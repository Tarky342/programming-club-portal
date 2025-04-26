import { useState, useCallback, useRef } from "react";

const WEBHOOK_URLS = {
    discord: import.meta.env.VITE_DISCORD_WEBHOOK,
    teams: import.meta.env.VITE_TEAMS_WEBHOOK
  };

export default function useNotificationForm() {
  // 🌿 状態管理
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [targets, setTargets] = useState({ discord: false, teams: false });
  const [errors, setErrors] = useState({ title: false, message: false, target: false });

  const textareaRef = useRef(null);

  // 📎 ファイル処理
  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    const unique = newFiles.filter((file) => !files.some((f) => f.name === file.name));
    setFiles([...files, ...unique]);

    const links = unique
      .map((file) => `[${file.name}](#)`)
      .filter((link) => !message.includes(link));

    if (links.length > 0) {
      setMessage((prev) => prev.trim() + "\n\n" + links.join("\n"));
    }
  }, [files, message]);

  // ✏️ Markdown挿入
  const insertAtSelection = (startTag, endTag = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const [start, end] = [el.selectionStart, el.selectionEnd];
    const selected = el.value.slice(start, end);
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    let adjustedStartTag = startTag;
    if (startTag.startsWith("\n") && before.length > 0 && !before.endsWith("\n")) {
      adjustedStartTag = "\n" + startTag;
    }

    if (selected.startsWith(startTag) && selected.endsWith(endTag)) {
      const unformatted = selected.slice(startTag.length, -endTag.length);
      setMessage(before + unformatted + after);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + unformatted.length);
      }, 0);
      return;
    }

    const newText = before + adjustedStartTag + selected + endTag + after;
    setMessage(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + adjustedStartTag.length, end + adjustedStartTag.length);
    }, 0);
  };

  // 🧼 Markdown整形
  const sanitize = {
    discord: (text) =>
      text
        .replace(/\r/g, "\n")
        .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, "$1 : $2")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),

    teams: (text) =>
      text
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/^-{3,}$/gm, "")
        .replace(/^_{3,}$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\n/g, "\r\n")
        .replace('\n', '\n\n')
        .trim(),
  };

  // 🎨 Discordカラー変換
  const hexToDecimal = (hex) => parseInt(hex.replace("#", ""), 16);

  // 📦 メッセージ生成
  const generateMessageJson = (text, platform, title, color = "0x7289DA") => {
    const body = sanitize[platform](text);

    if (platform === "discord") {
      return {
        embeds: [{ title, description: body, color: hexToDecimal(color) }],
      };
    }

    if (platform === "teams") {
      return {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
              type: "AdaptiveCard",
              version: "1.4",
              body: [
                {
                  type: "TextBlock",
                  text: `**${title}**\r\n\r\n${body}`,
                  wrap: true,
                },
              ],
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            },
          },
        ],
      };
    }

    return {};
  };

  // 🚀 POST送信
  const post = (data, url) => {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((resJson) => console.log("✅ 成功:", resJson))
      .catch((err) => console.error("❌ 失敗:", err.message));
  };

  // 🎯 フォーム送信
  const handleSubmit = () => {
    if (!validateForm()) return;
    const active = Object.entries(targets)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!title.trim() || !message.trim() || active.length === 0) return;

    active.forEach((platform) => {
      const payload = generateMessageJson(message, platform, title);
      const url = WEBHOOK_URLS[platform];
      post(payload, url);
    });

    alert("✅ 送信完了！\n\n" + active.join(", ") + "に送信しました");
  };

  // バリデーション
  const validateForm = () => {
    const newErrors = {
      title: title.trim() === "",
      message: message.trim() === "",
      target: !Object.values(targets).includes(true),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const isValid = title.trim() && message.trim() && Object.values(targets).includes(true);

  return {
    title,
    setTitle,
    message,
    setMessage,
    files,
    setFiles,
    targets,
    setTargets,
    errors,
    isValid,
    textareaRef,
    handleFileChange,
    insertAtSelection,
    handleSubmit,
    validateForm,
  };
}
