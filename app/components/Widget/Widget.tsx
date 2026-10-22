"use client";

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <base target="_blank">
</head>
<body>
  <script src="https://widget.dybka.ru/slider/embed.php"></script>
</body>
</html>`;

export default function Widget() {
    return (
        <iframe
            srcDoc={html}
            title="Новомученики и исповедники"
            className="w-full h-[800px] border-0 rounded-[12px]"
            loading="lazy"
        />
    );
}
