"use client";

import { BookOpenText, Keyboard } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BIBLE_BOOKS,
  buildScriptureReference,
  getBibleBook,
} from "@/lib/scripture/books";
import { cn } from "@/lib/utils";

type ScriptureReferenceInputProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  ariaDescribedBy?: string;
};

type Mode = "structured" | "manual";

const selectClassName =
  "h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/70 focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50";

function sanitizeVerse(value: string) {
  const digits = value.replace(/\D/g, "");
  const parsed = Number(digits);

  if (!digits || parsed < 1) {
    return "";
  }

  return String(Math.min(parsed, 176));
}

export function ScriptureReferenceInput({
  value,
  onChange,
  maxLength = 120,
  ariaDescribedBy,
}: ScriptureReferenceInputProps) {
  const [mode, setMode] = useState<Mode>(() => (value ? "manual" : "structured"));
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verseStart, setVerseStart] = useState("");
  const [verseEnd, setVerseEnd] = useState("");
  const [manualReference, setManualReference] = useState(value);

  const selectedBook = useMemo(() => getBibleBook(book), [book]);
  const chapters = useMemo(
    () =>
      selectedBook
        ? Array.from({ length: selectedBook.chapters }, (_, index) => index + 1)
        : [],
    [selectedBook],
  );

  function updateStructuredReference(
    nextBook = book,
    nextChapter = chapter,
    nextStart = verseStart,
    nextEnd = verseEnd,
  ) {
    onChange(
      buildScriptureReference({
        book: nextBook,
        chapter: nextChapter,
        verseStart: nextStart,
        verseEnd: nextEnd,
      }),
    );
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);

    if (nextMode === "manual") {
      const nextManual = manualReference || value;
      setManualReference(nextManual);
      onChange(nextManual);
      return;
    }

    if (book && chapter) {
      updateStructuredReference();
    }
  }

  return (
    <div className="grid gap-4">
      <div
        role="group"
        className="inline-grid w-fit grid-cols-2 rounded-md border border-border bg-background p-1"
        aria-label="Scripture reference input mode"
      >
        <button
          type="button"
          onClick={() => changeMode("structured")}
          aria-pressed={mode === "structured"}
          className={cn(
            "flex h-10 items-center gap-2 rounded-sm px-3 text-xs transition-colors",
            mode === "structured"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <BookOpenText className="size-3.5" />
          Structured
        </button>
        <button
          type="button"
          onClick={() => changeMode("manual")}
          aria-pressed={mode === "manual"}
          className={cn(
            "flex h-10 items-center gap-2 rounded-sm px-3 text-xs transition-colors",
            mode === "manual"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Keyboard className="size-3.5" />
          Manual
        </button>
      </div>

      {mode === "structured" ? (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(7rem,0.6fr)]">
            <div className="grid gap-2">
              <Label htmlFor="scripture-book">Book</Label>
              <select
                id="scripture-book"
                className={selectClassName}
                value={book}
                aria-describedby={ariaDescribedBy}
                onChange={(event) => {
                  const nextBook = event.target.value;
                  setBook(nextBook);
                  setChapter("");
                  setVerseStart("");
                  setVerseEnd("");
                  onChange("");
                }}
              >
                <option value="">Select book</option>
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter(
                    (item) => item.testament === "Old Testament",
                  ).map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter(
                    (item) => item.testament === "New Testament",
                  ).map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scripture-chapter">Chapter</Label>
              <select
                id="scripture-chapter"
                className={selectClassName}
                value={chapter}
                disabled={!selectedBook}
                onChange={(event) => {
                  const nextChapter = event.target.value;
                  setChapter(nextChapter);
                  setVerseStart("");
                  setVerseEnd("");
                  updateStructuredReference(book, nextChapter, "", "");
                }}
              >
                <option value="">Select</option>
                {chapters.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="verse-start">Start verse</Label>
              <Input
                id="verse-start"
                inputMode="numeric"
                value={verseStart}
                disabled={!chapter}
                placeholder="Optional"
                onChange={(event) => {
                  const nextStart = sanitizeVerse(event.target.value);
                  const nextEnd =
                    verseEnd && Number(verseEnd) < Number(nextStart)
                      ? ""
                      : verseEnd;

                  setVerseStart(nextStart);
                  setVerseEnd(nextEnd);
                  updateStructuredReference(book, chapter, nextStart, nextEnd);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="verse-end">End verse</Label>
              <Input
                id="verse-end"
                inputMode="numeric"
                value={verseEnd}
                disabled={!verseStart}
                placeholder="Optional"
                onChange={(event) => {
                  let nextEnd = sanitizeVerse(event.target.value);

                  if (
                    nextEnd &&
                    verseStart &&
                    Number(nextEnd) < Number(verseStart)
                  ) {
                    nextEnd = verseStart;
                  }

                  setVerseEnd(nextEnd);
                  updateStructuredReference(book, chapter, verseStart, nextEnd);
                }}
              />
            </div>
          </div>

          <div className="rounded-md border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Reference
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                value ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {value || "Select a book and chapter"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="scripture-reference-manual">Reference</Label>
          <Input
            id="scripture-reference-manual"
            value={manualReference}
            maxLength={maxLength}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => {
              const nextValue = event.target.value;
              setManualReference(nextValue);
              onChange(nextValue);
            }}
            placeholder="e.g. Psalm 23:1-4"
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Use manual mode for complex references or passages that span more
            than one chapter.
          </p>
        </div>
      )}

      <input type="hidden" name="scriptureReference" value={value} />
    </div>
  );
}
