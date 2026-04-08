import pathlib
import re


def main() -> None:
    root = pathlib.Path(__file__).resolve().parents[1]
    html_path = root / "index.html"
    text = html_path.read_text(encoding="utf-8")

    # Extract all <style> blocks.
    style_re = re.compile(r"<style>\s*(.*?)\s*</style>", re.IGNORECASE | re.DOTALL)
    styles = style_re.findall(text)
    css = ("\n\n".join(styles)).strip() + "\n"

    # Extract inline <script> blocks without attributes (current file uses <script> ... </script>).
    script_re = re.compile(r"<script>\s*(.*?)\s*</script>", re.IGNORECASE | re.DOTALL)
    scripts = script_re.findall(text)
    js = ("\n\n".join(s for s in (s.strip() for s in scripts) if s)).strip() + "\n"

    # Remove extracted blocks from HTML.
    text2 = style_re.sub("", text)
    text2 = script_re.sub("", text2)

    # Insert external CSS link (after font-awesome) preserving load order.
    marker = (
        '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" '
        'rel="stylesheet">'
    )
    if marker in text2:
        text2 = text2.replace(marker, marker + '\n<link rel="stylesheet" href="assets/css/styles.css">', 1)
    else:
        # Fallback: insert before </head>
        text2 = text2.replace("</head>", '<link rel="stylesheet" href="assets/css/styles.css">\n</head>', 1)

    # Update favicon path.
    text2 = text2.replace('href="favicon.ico"', 'href="assets/img/favicon.ico"')

    # Update moved asset src references (only local ones).
    local_files = [
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
        "Sistema de gestao completo todo branco.png",
    ]
    for f in local_files:
        text2 = text2.replace(f'src="{f}"', f'src="assets/img/{f}"')

    # Update video src.
    text2 = text2.replace('src="Video Bomman.MOV"', 'src="assets/video/Video Bomman.MOV"')

    # Add external main JS before </body>.
    text2 = text2.replace("</body>", '\n<script src="assets/js/main.js" defer></script>\n</body>', 1)

    # Ensure asset directories exist, then write files.
    (root / "assets" / "css").mkdir(parents=True, exist_ok=True)
    (root / "assets" / "js").mkdir(parents=True, exist_ok=True)
    (root / "assets" / "css" / "styles.css").write_text(css, encoding="utf-8")
    (root / "assets" / "js" / "main.js").write_text(js, encoding="utf-8")

    # Fix CSS urls (CSS is now in assets/css, so images are ../img/*).
    css2 = css.replace(
        "url('PHOTO-2025-03-01-09-46-05 20.jpg')", "url('../img/PHOTO-2025-03-01-09-46-05 20.jpg')"
    )
    (root / "assets" / "css" / "styles.css").write_text(css2, encoding="utf-8")

    html_path.write_text(text2, encoding="utf-8")


if __name__ == "__main__":
    main()

