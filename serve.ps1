$root = $PSScriptRoot
$port = 8080
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Serving $root at $prefix"
Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  $relativePath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    $relativePath = "index.html"
  }

  $filePath = Join-Path $root $relativePath

  if (Test-Path $filePath -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $contentType = switch ($ext) {
      ".html" { "text/html; charset=utf-8" }
      ".css"  { "text/css; charset=utf-8" }
      ".js"   { "application/javascript; charset=utf-8" }
      ".svg"  { "image/svg+xml" }
      ".pdf"  { "application/pdf" }
      ".png"  { "image/png" }
      ".jpg"  { "image/jpeg" }
      ".jpeg" { "image/jpeg" }
      default { "application/octet-stream" }
    }
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
    $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $response.ContentType = "text/plain; charset=utf-8"
    $response.ContentLength64 = $body.Length
    $response.OutputStream.Write($body, 0, $body.Length)
  }

  $response.OutputStream.Close()
}
