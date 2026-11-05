<?php
/* ==========================================================================
   RATUS VILLA — API d'administration (hébergement PHP)
   --------------------------------------------------------------------------
   Utilisée automatiquement par /admin quand le site est sur un hébergeur
   qui exécute PHP (cPanel, Hostinger, Niagahoster, etc.).

   - Premier accès : /admin propose de créer le mot de passe.
   - Mot de passe oublié : supprimer le fichier admin/data/auth.php
     (via le gestionnaire de fichiers de l'hébergeur), puis retourner sur /admin
     pour en créer un nouveau.
   ========================================================================== */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const ROOT        = __DIR__ . '/..';
const DATA_DIR    = __DIR__ . '/data';
const AUTH_FILE   = DATA_DIR . '/auth.php';
const ATTEMPTS    = DATA_DIR . '/attempts.json';
const CONTENT     = ROOT . '/content/content.json';
const BACKUP_DIR  = ROOT . '/content/backups';
const UPLOAD_DIR  = ROOT . '/assets/uploads';
const MAX_JSON    = 3 * 1024 * 1024;     // 3 Mo
const MAX_IMAGE   = 20 * 1024 * 1024;    // 20 Mo
const MAX_VIDEO   = 120 * 1024 * 1024;   // 120 Mo (dans la limite de l'hébergeur)
const KEEP_BACKUPS = 30;

function out(array $data, int $code = 200): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $error, int $code = 400): void { out(['ok' => false, 'error' => $error], $code); }

function ensure_dir(string $dir): void {
  if (!is_dir($dir) && !mkdir($dir, 0755, true)) fail('cannot_create_dir', 500);
}
function protect_data_dir(): void {
  ensure_dir(DATA_DIR);
  if (!file_exists(DATA_DIR . '/.htaccess')) @file_put_contents(DATA_DIR . '/.htaccess', "Require all denied\nDeny from all\n");
  if (!file_exists(DATA_DIR . '/index.html')) @file_put_contents(DATA_DIR . '/index.html', '');
}
function has_password(): bool { return is_file(AUTH_FILE); }
function read_auth(): array { $a = has_password() ? include AUTH_FILE : []; return is_array($a) ? $a : []; }
function write_auth(string $password): void {
  protect_data_dir();
  $hash = password_hash($password, PASSWORD_DEFAULT);
  $php = "<?php\n// Généré par /admin. Supprimer ce fichier pour réinitialiser le mot de passe.\nreturn " . var_export(['hash' => $hash, 'updated' => date('c')], true) . ";\n";
  if (file_put_contents(AUTH_FILE, $php, LOCK_EX) === false) fail('cannot_write_auth', 500);
  @chmod(AUTH_FILE, 0600);
}

function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? 'unknown'; }
function attempts_load(): array { $d = is_file(ATTEMPTS) ? json_decode((string)file_get_contents(ATTEMPTS), true) : []; return is_array($d) ? $d : []; }
function attempts_save(array $d): void { protect_data_dir(); @file_put_contents(ATTEMPTS, json_encode($d), LOCK_EX); }
function too_many_attempts(): bool {
  $d = attempts_load(); $ip = client_ip(); $now = time();
  $list = array_values(array_filter($d[$ip] ?? [], fn($t) => $t > $now - 900));
  return count($list) >= 8;
}
function record_failure(): void {
  $d = attempts_load(); $ip = client_ip(); $now = time();
  $d[$ip] = array_values(array_filter($d[$ip] ?? [], fn($t) => $t > $now - 900));
  $d[$ip][] = $now;
  attempts_save($d);
}

function start_session(bool $remember = false): void {
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  session_name('ratus_admin');
  session_set_cookie_params([
    'lifetime' => $remember ? 60 * 60 * 24 * 60 : 0,
    'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict',
  ]);
  if (session_status() !== PHP_SESSION_ACTIVE) { ini_set('session.gc_maxlifetime', (string)(60 * 60 * 24 * 60)); session_start(); }
}
function logged_in(): bool {
  return !empty($_SESSION['ok']) && ($_SESSION['auth'] ?? '') === (read_auth()['updated'] ?? '-');
}
function require_login(): void { if (!logged_in()) fail('not_logged_in', 401); }
function require_post(): void {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('method_not_allowed', 405);
  // En-tête personnalisé : bloque les requêtes envoyées depuis un autre site (CSRF)
  if (($_SERVER['HTTP_X_RATUS_ADMIN'] ?? '') !== '1') fail('bad_request', 400);
}
function body_json(): array {
  $raw = file_get_contents('php://input', false, null, 0, MAX_JSON + 1);
  if ($raw === false || strlen($raw) > MAX_JSON) fail('too_large', 413);
  $d = json_decode($raw, true);
  if (!is_array($d)) fail('bad_json');
  return $d;
}
function ini_bytes(string $v): int {
  $v = trim($v); if ($v === '') return 0;
  $n = (int)$v; $u = strtolower(substr($v, -1));
  return $u === 'g' ? $n * 1073741824 : ($u === 'm' ? $n * 1048576 : ($u === 'k' ? $n * 1024 : $n));
}
function login_session(bool $remember): void {
  start_session($remember);
  session_regenerate_id(true);
  $_SESSION['ok'] = true;
  $_SESSION['auth'] = read_auth()['updated'] ?? '';
  if ($remember) { // garder la connexion 60 jours sur cet appareil
    $p = session_get_cookie_params();
    setcookie(session_name(), session_id(), ['expires' => time() + 60 * 60 * 24 * 60, 'path' => '/', 'secure' => $p['secure'], 'httponly' => true, 'samesite' => 'Strict']);
  }
}

$action = $_GET['action'] ?? '';
start_session(isset($_COOKIE['ratus_admin']));

switch ($action) {

  case 'status':
    out([
      'ok' => true, 'mode' => 'php',
      'hasPassword' => has_password(), 'loggedIn' => logged_in(),
      'maxUpload' => min(ini_bytes((string)ini_get('upload_max_filesize')), ini_bytes((string)ini_get('post_max_size'))),
      'writable' => is_writable(dirname(CONTENT)),
    ]);

  case 'setup':
    require_post();
    if (has_password()) fail('already_set', 403);
    $d = body_json(); $pw = (string)($d['password'] ?? '');
    if (mb_strlen($pw) < 8) fail('password_too_short');
    write_auth($pw);
    login_session(true);
    out(['ok' => true]);

  case 'login':
    require_post();
    if (!has_password()) fail('no_password', 403);
    if (too_many_attempts()) fail('too_many_attempts', 429);
    $d = body_json();
    if (!password_verify((string)($d['password'] ?? ''), read_auth()['hash'] ?? '')) { record_failure(); usleep(800000); fail('wrong_password', 401); }
    login_session(!empty($d['remember']));
    out(['ok' => true]);

  case 'logout':
    require_post();
    $_SESSION = []; session_destroy();
    out(['ok' => true]);

  case 'password':
    require_post(); require_login();
    $d = body_json();
    if (!password_verify((string)($d['current'] ?? ''), read_auth()['hash'] ?? '')) { record_failure(); fail('wrong_password', 401); }
    $new = (string)($d['password'] ?? '');
    if (mb_strlen($new) < 8) fail('password_too_short');
    write_auth($new);
    login_session(true);
    out(['ok' => true]);

  case 'load':
    require_login();
    $raw = is_file(CONTENT) ? file_get_contents(CONTENT) : '{}';
    echo '{"ok":true,"content":' . $raw . '}'; exit;

  case 'save':
    require_post(); require_login();
    $d = body_json();
    if (!isset($d['content']) || !is_array($d['content'])) fail('bad_content');
    $json = json_encode($d['content'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) fail('bad_content');
    ensure_dir(BACKUP_DIR);
    if (is_file(CONTENT)) copy(CONTENT, BACKUP_DIR . '/content-' . date('Ymd-His') . '.json');
    $tmp = CONTENT . '.tmp';
    if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false || !rename($tmp, CONTENT)) fail('cannot_write_content', 500);
    $files = glob(BACKUP_DIR . '/content-*.json') ?: []; rsort($files);
    foreach (array_slice($files, KEEP_BACKUPS) as $old) @unlink($old);
    out(['ok' => true, 'savedAt' => date('c')]);

  case 'upload':
    require_post(); require_login();
    $f = $_FILES['file'] ?? null;
    if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) fail('upload_error_' . (int)($f['error'] ?? 4));
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) ?: '';
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov'];
    if (!isset($types[$mime])) fail('bad_file_type');
    $isVideo = str_starts_with($mime, 'video/');
    if ($f['size'] > ($isVideo ? MAX_VIDEO : MAX_IMAGE)) fail('too_large', 413);
    $base = strtolower((string)preg_replace('/[^a-z0-9]+/i', '-', pathinfo((string)($_POST['name'] ?? $f['name']), PATHINFO_FILENAME)));
    $base = trim(substr($base, 0, 50), '-') ?: 'file';
    ensure_dir(UPLOAD_DIR);
    $name = $base . '-' . date('ymdHis') . '-' . bin2hex(random_bytes(2)) . '.' . $types[$mime];
    if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . '/' . $name)) fail('cannot_save_file', 500);
    @chmod(UPLOAD_DIR . '/' . $name, 0644);
    out(['ok' => true, 'path' => 'assets/uploads/' . $name]);

  case 'backups':
    require_login();
    $files = glob(BACKUP_DIR . '/content-*.json') ?: []; rsort($files);
    out(['ok' => true, 'backups' => array_map(fn($p) => ['name' => basename($p), 'size' => filesize($p)], array_slice($files, 0, KEEP_BACKUPS))]);

  case 'restore':
    require_post(); require_login();
    $d = body_json(); $name = basename((string)($d['name'] ?? ''));
    if (!preg_match('/^content-\d{8}-\d{6}\.json$/', $name) || !is_file(BACKUP_DIR . '/' . $name)) fail('not_found', 404);
    if (is_file(CONTENT)) copy(CONTENT, BACKUP_DIR . '/content-' . date('Ymd-His') . '.json');
    copy(BACKUP_DIR . '/' . $name, CONTENT);
    out(['ok' => true]);

  default:
    fail('unknown_action', 404);
}
