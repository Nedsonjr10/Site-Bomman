$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$indexPath = Join-Path $root "index.html"
$html = Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8

# Extract <style> blocks
$styleMatches = [regex]::Matches($html, "<style>\s*(.*?)\s*</style>", "IgnoreCase,Singleline")
$cssParts = @()
foreach ($m in $styleMatches) { $cssParts += $m.Groups[1].Value }
$css = ($cssParts -join "`r`n`r`n").Trim() + "`r`n"

# Extract inline <script> blocks (no attributes in this file's inline scripts)
$scriptMatches = [regex]::Matches($html, "<script>\s*(.*?)\s*</script>", "IgnoreCase,Singleline")
$jsParts = @()
foreach ($m in $scriptMatches) {
  $v = $m.Groups[1].Value.Trim()
  if ($v) { $jsParts += $v }
}
$js = ($jsParts -join "`r`n`r`n").Trim() + "`r`n"

# Remove extracted blocks from HTML
$html2 = [regex]::Replace($html, "<style>\s*(.*?)\s*</style>", "", "IgnoreCase,Singleline")
$html2 = [regex]::Replace($html2, "<script>\s*(.*?)\s*</script>", "", "IgnoreCase,Singleline")

# Insert external CSS link after font-awesome link (preserves load order)
$fa = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">'
if ($html2.Contains($fa)) {
  $parts = $html2.Split(@($fa), 2, [System.StringSplitOptions]::None)
  $html2 = $parts[0] + $fa + "`r`n<link rel=""stylesheet"" href=""assets/css/styles.css"">" + $parts[1]
} else {
  $html2 = $html2 -replace "</head>", "<link rel=""stylesheet"" href=""assets/css/styles.css"">`r`n</head>"
}

# Update favicon path
$html2 = $html2.Replace('href="favicon.ico"', 'href="assets/img/favicon.ico"')

# Update local image sources moved to assets/img
$localFiles = @(
  "01-Símbolo-Blue.png",
  "04-Logo-Horizontal-Light.png",
  "amadeu.jpg",
  "Bomman foto do Video.png",
  "cliente1.png",
  "cliente2.jpeg",
  "cliente3.jpeg",
  "cliente4.png",
  "cliente5.png",
  "Diario de obra todo branco.png",
  "diario1.jpg",
  "diario2.png",
  "Equipe presente em campo engenharia  todo branco.png",
  "equipe1.jpg",
  "equipe2.jpg",
  "equipe3.jpg",
  "equipe4.jpg",
  "equipe5.jpg",
  "equipe6.jpg",
  "Gesta.jpg",
  "Gesta2.jpg",
  "Gesta3.jpg",
  "Gesta4.jpg",
  "PHOTO-2025-01-25-11-06-41 5.jpg",
  "PHOTO-2025-03-01-09-46-05 20.jpg",
  "projeto1.jpg",
  "projeto2.jpg",
  "projeto3.jpg",
  "projeto4.jpg",
  "projeto5.jpg",
  "projeto6.jpg",
  "projeto7.jpg",
  "projeto8.jpg",
  "projeto9.jpg",
  "projeto10.jpg",
  "Qualidade e controle por etapa todo branco.png",
  "qualidade1.jpg",
  "qualidade2.jpg",
  "qualidade3.jpg",
  "qualidade4.jpg",
  "qualidade5.jpg",
  "qualidade6.jpg",
  "Sistema de gestao completo todo branco.png"
)
foreach ($f in $localFiles) {
  $html2 = $html2.Replace("src=""$f""", "src=""assets/img/$f""")
}

# Update video src
$html2 = $html2.Replace('src="Video Bomman.MOV"', 'src="assets/video/Video Bomman.MOV"')

# Add external JS before </body>
$html2 = $html2 -replace "</body>", "`r`n<script src=""assets/js/main.js"" defer></script>`r`n</body>"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path (Join-Path $root "assets\css") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $root "assets\js") | Out-Null

# Fix CSS relative URLs (CSS now lives in assets/css)
$css = $css.Replace("url('PHOTO-2025-03-01-09-46-05 20.jpg')", "url('../img/PHOTO-2025-03-01-09-46-05 20.jpg')")

# Write files
Set-Content -LiteralPath (Join-Path $root "assets\css\styles.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $root "assets\js\main.js") -Value $js -Encoding UTF8
Set-Content -LiteralPath $indexPath -Value $html2 -Encoding UTF8

Write-Host "OK: wrote assets/css/styles.css, assets/js/main.js and updated index.html"

