$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $repoRoot ".env"

function ConvertFrom-SecureStringToPlainText {
  param([Security.SecureString] $SecureValue)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

function Read-EnvFile {
  param([string] $Path)

  $values = [ordered]@{}

  if (Test-Path -LiteralPath $Path) {
    foreach ($line in Get-Content -LiteralPath $Path) {
      if ($line -match "^\s*#" -or $line -notmatch "=") {
        continue
      }

      $key, $value = $line -split "=", 2
      $values[$key.Trim()] = $value.Trim()
    }
  }

  return $values
}

function Read-Value {
  param(
    [string] $Prompt,
    [string] $Default
  )

  if ($Default) {
    $value = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($value)) {
      return $Default
    }
    return $value.Trim()
  }

  return (Read-Host $Prompt).Trim()
}

$existing = Read-EnvFile -Path $envPath

$defaultFrontendUrl = "https://your-website-domain"
if ($existing.Contains("FRONTEND_URL") -and -not [string]::IsNullOrWhiteSpace($existing["FRONTEND_URL"])) {
  $defaultFrontendUrl = $existing["FRONTEND_URL"]
}

$defaultApiBaseUrl = "https://your-server-domain"
if ($existing.Contains("VITE_API_BASE_URL") -and -not [string]::IsNullOrWhiteSpace($existing["VITE_API_BASE_URL"])) {
  $defaultApiBaseUrl = $existing["VITE_API_BASE_URL"]
}

$defaultPort = "4242"
if ($existing.Contains("PORT") -and -not [string]::IsNullOrWhiteSpace($existing["PORT"])) {
  $defaultPort = $existing["PORT"]
}

$secretValue = ConvertFrom-SecureStringToPlainText `
  (Read-Host "Paste Stripe live secret key (starts with sk_live_)" -AsSecureString)

if (-not $secretValue.StartsWith("sk_live_")) {
  throw "That does not look like a Stripe live secret key. It must start with sk_live_."
}

$frontendUrl = Read-Value `
  -Prompt "Public website URL used after Checkout success/cancel" `
  -Default $defaultFrontendUrl

$apiBaseUrl = Read-Value `
  -Prompt "Public helper server URL used by the website" `
  -Default $defaultApiBaseUrl

$port = Read-Value `
  -Prompt "Server port" `
  -Default $defaultPort

$envLines = @(
  "STRIPE_SECRET_KEY=$secretValue"
  "STRIPE_LIVE_MODE_REQUIRED=true"
  "FRONTEND_URL=$frontendUrl"
  "PORT=$port"
  "VITE_API_BASE_URL=$apiBaseUrl"
)

foreach ($key in @(
  "YOUTUBE_CHANNEL_ID",
  "YOUTUBE_CHANNEL_URL",
  "YOUTUBE_API_KEY",
  "YOUTUBE_CACHE_TTL_MS"
)) {
  if ($existing.Contains($key) -and -not [string]::IsNullOrWhiteSpace($existing[$key])) {
    $envLines += "$key=$($existing[$key])"
  }
}

Set-Content -LiteralPath $envPath -Value $envLines -Encoding UTF8

Write-Host ""
Write-Host "Stripe live mode is configured in .env."
Write-Host "Restart the helper server, then open /status and confirm stripe is live."
