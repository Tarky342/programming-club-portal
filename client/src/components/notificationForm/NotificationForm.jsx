import React from "react";
import {
  faItalic,
  faLink,
  faCode,
  faList,
  faUpload,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNotificationForm from "./useNotificationForm";
import "./NotificationForm.module.css";
const NotificationForm = () => {
  const {
    title,
    setTitle,
    message,
    setMessage,
    targets,
    setTargets,
    errors,
    isValid,
    handleFileChange,
    handleSubmit,
    insertAtSelection,
    validateForm,
    textareaRef,
  } = useNotificationForm();

  return (
    <div className="form-container">
      <h2 className="header">通知作成フォーム</h2>

      {/* タイトル入力 */}
      <input
        className={`title-input ${errors.title ? "error" : ""}`}
        placeholder="タイトルを入力..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={validateForm}
      />
      {errors.title && <p className="error-text">タイトルは必須</p>}

      {/* 本文（Markdown） */}
      <textarea
        ref={textareaRef}
        className={`markdown-editor ${errors.message ? "error" : ""}`}
        placeholder="本文をMarkdown形式で記述..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={validateForm}
      />
      {errors.message && (
        <p className="error-text">本文が空やと送信できません</p>
      )}

      {/* Markdownツールバー */}
      <div className="markdown-toolbar">
        <button title="太字" onClick={() => insertAtSelection("**", "**")}>
          <strong>B</strong>
        </button>
        <button title="斜体" onClick={() => insertAtSelection("_", "_")}>
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button title="リンク" onClick={() => insertAtSelection("[", "]()")}>
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button title="コード" onClick={() => insertAtSelection("`", "`")}>
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button
          title="箇条書き"
          onClick={() => insertAtSelection("\n- ", "\r\n")}
        >
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>

      {/* ファイルアップロード（現在無効） */}
      <label
        className="file-upload"
        style={{
          color: "gray",
          pointerEvents: "none",
          opacity: 0.5,
          cursor: "not-allowed",
        }}
        title="ファイルは今は無効"
      >
        <FontAwesomeIcon icon={faUpload} /> ファイル追加
        <input type="file" multiple hidden onChange={handleFileChange} />
      </label>

      {/* 送信先選択 */}
      <div className="checkbox-group">
        <button
          className={`target-btn ${targets.discord ? "active" : ""} discord`}
          onClick={() =>
            setTargets((prev) => ({ ...prev, discord: !prev.discord }))
          }
          title="Discordに送信"
        >
          <FontAwesomeIcon icon={faDiscord} /> Discord
        </button>
        <button
          className={`target-btn ${targets.teams ? "active" : ""} teams`}
          onClick={() =>
            setTargets((prev) => ({ ...prev, teams: !prev.teams }))
          }
          title="Teamsに送信"
        >
          Teams
        </button>
        {errors.target && (
          <p className="error-text">少なくとも1つ送信先を選んでおくれや</p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        className="submit-button"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        <FontAwesomeIcon icon={faPaperPlane} /> 送信
      </button>
    </div>
  );
};

export default NotificationForm;