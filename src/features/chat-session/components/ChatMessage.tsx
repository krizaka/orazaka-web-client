import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { SentinelMini } from "@krizaka/orazaka-design-system";
import { ChatMessage as ChatMessageType } from "@/core/types/chat.types";
import { useTranslation } from "@/core/context/LocaleContext";

import { cn } from "@krizaka/ui/cn";

interface Props {
  message: ChatMessageType;
  index?: number;
}

const MarkdownH1 = ({ children }: { children?: React.ReactNode }) => (
  <h1 className="text-base font-semibold mt-3 mb-1 text-fg">
    {children}
  </h1>
);

const MarkdownH2 = ({ children }: { children?: React.ReactNode }) => (
  <h2 className="text-[13px] font-semibold mt-3 mb-1 text-fg">
    {children}
  </h2>
);

const MarkdownH3 = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="text-[12px] font-semibold mt-2 mb-1 text-fg">
    {children}
  </h3>
);

const MarkdownP = ({ children }: { children?: React.ReactNode }) => (
  <p className="mb-2 last:mb-0 leading-relaxed break-words whitespace-pre-wrap">
    {children}
  </p>
);

const markdownComponents = {
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  p: MarkdownP,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="mb-0.5">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-fg">
      {children}
    </strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:underline break-all"
    >
      {children}
    </a>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="overflow-x-auto rounded-xl bg-surface-2 p-3 my-2 font-mono text-[11px] text-fg border border-border-subtle shadow-inner">
      {children}
    </pre>
  ),
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-surface-3 rounded px-1 py-0.5 font-mono text-[11px] text-fg">
        {children}
      </code>
    ) : (
      <code className={className}>{children}</code>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-border-default pl-3 py-0.5 italic my-2 text-fg-secondary">
      {children}
    </blockquote>
  ),
};

const ContentText: React.FC<Readonly<{ content: string }>> = ({ content }) => (
  <div className="max-w-none text-fg">
    <ReactMarkdown components={markdownComponents}>
      {content}
    </ReactMarkdown>
  </div>
);

const ContentImage: React.FC<{ content: string }> = ({ content }) => (
  <div className="mt-1 rounded-xl overflow-hidden border border-border-subtle bg-surface-2 max-w-sm shadow-sm transition-all duration-200 hover:scale-[1.01]">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={content}
      alt="Generated Asset"
      className="w-full object-contain max-h-[300px]"
    />
  </div>
);

const ContentAudio: React.FC<{ content: string }> = ({ content }) => (
  <div className="mt-1 flex items-center justify-center p-2 rounded-xl border border-border-subtle bg-surface-2 min-w-[240px] shadow-sm">
    <audio src={content} controls className="w-full focus:outline-none">
      <track kind="captions" />
    </audio>
  </div>
);

const ContentVideo: React.FC<{ content: string }> = ({ content }) => (
  <div className="mt-1 rounded-xl overflow-hidden border border-border-subtle bg-surface-2 max-w-sm shadow-sm">
    <video
      src={content}
      controls
      playsInline
      preload="metadata"
      className="w-full object-contain max-h-[320px] bg-media"
    >
      <track kind="captions" />
    </video>
  </div>
);

export const ChatMessage: React.FC<Props> = ({ message, index = 0 }) => {
  const isUser = message.role === "user";
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const renderContent = () => {
    switch (message.kind) {
      case "image":
        return <ContentImage content={message.content} />;
      case "video":
        return <ContentVideo content={message.content} />;
      case "audio":
        return <ContentAudio content={message.content} />;
      case "run-pending":
        return (
          <div className="flex items-center gap-3 text-[13px]">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none" />
            </span>
            <span className="text-fg-secondary">
              {message.content || t.chat.generating}
            </span>
            <a
              href={`/studios/runs/${message.runId}`}
              className="text-accent hover:underline whitespace-nowrap"
            >
              {t.chat.viewTask} →
            </a>
          </div>
        );
      case "text":
      default:
        return <ContentText content={message.content} />;
    }
  };

  return (
    <motion.article
      data-testid={`chat-message-${message.role}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 30,
        mass: 0.7,
        delay: Math.min(index * 0.04, 0.3),
      }}
      className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex max-w-[75%] gap-3 items-start",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <figure
          className={cn(
            "h-9 w-9 rounded-2xl flex items-center justify-center text-[11px] font-bold border select-none flex-shrink-0 transition-colors duration-200",
            isUser
              ? "bg-accent-soft border-accent/20 text-accent"
              : "bg-surface-2 border-border-subtle text-fg-secondary"
          )}
        >
          {isUser ? t.chat.user[0] : <SentinelMini size={18} />}
        </figure>

        <section
          className={cn(
            "p-4 rounded-2xl border text-[13px] leading-[1.7] text-fg transition-shadow duration-200",
            isUser
              ? "bg-accent-soft border-accent/10 rounded-tr-md"
              : "bg-surface-1 border-border-subtle rounded-tl-md"
          )}
        >
          {message.attachment?.url ? (
            <figure className="mb-2 rounded-xl overflow-hidden border border-border-subtle bg-surface-2 max-w-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.attachment.url}
                alt={message.attachment.name}
                className="w-full object-contain max-h-[180px]"
              />
            </figure>
          ) : null}
          {renderContent()}
          <span className="text-[10px] text-fg-muted block mt-2 text-right select-none tabular-nums">
            {format(message.timestamp, "HH:mm")}
          </span>
        </section>
      </div>
    </motion.article>
  );
};
