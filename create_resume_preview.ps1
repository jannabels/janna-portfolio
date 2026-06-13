$base64 = Get-Content -Path "C:\Users\janna\portfolio\JANNA_RESUME.b64" -Raw
$html = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Preview</title>
    <style>
      body { margin: 0; background: #fff; }
      iframe { width: 100%; height: 100vh; border: 0; display: block; }
    </style>
  </head>
  <body>
    <iframe src="data:application/pdf;base64,$base64" title="Resume Preview"></iframe>
  </body>
</html>
"@
Set-Content -Path "C:\Users\janna\portfolio\resume-preview.html" -Value $html -NoNewline
