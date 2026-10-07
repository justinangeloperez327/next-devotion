"use client";

import {
  BookOpenText,
  Eye,
  Globe2,
  Lock,
  RotateCcw,
} from "lucide-react";
import {
  useActionState,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ScriptureReferenceInput } from "@/components/devotion/scripture-reference-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  initialDevotionFormState,
  type DevotionFormState,
  type DevotionFormValues,
} from "@/lib/devotion/types";
import { cn } from "@/lib/utils";

type Visibility = "PUBLIC" | "PRIVATE";

type DevotionComposerProps = {
  action: (
    previousState: DevotionFormState,
    formData: FormData,
  ) => Promise<DevotionFormState>;
  initialValues?: DevotionFormValues;
  mode?: "create" | "edit";
};

const EMPTY_VALUES: DevotionFormValues = {
  scriptureReference: "",
  scriptureText: "",
  observation: "",
  application: "",
  prayer: "",
  visibility: "PUBLIC",
};

const MAX_REFERENCE = 120;
const MAX_SCRIPTURE = 1200;
const MAX_SECTION = 4000;

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span
      className={cn(
        "text-[11px] text-muted-foreground",
        value.length > max * 0.9 && "text-primary",
      )}
    >
      {value.length}/{max}
    </span>
  );
}

function FieldError({
  children,
  id,
}: {
  children?: string;
  id?: string;
}) {
  if (!children) {
    return null;
  }

  return (
    <p id={id} className="text-xs leading-5 text-destructive" role="alert">
      {children}
    </p>
  );
}

function EditorSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-7 first:border-t-0 first:pt-0">
      <div className="grid gap-4 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
          {number}
        </p>
        <div>
          <h2 className="text-base font-medium text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

function PreviewSection({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value.trim()) {
    return null;
  }

  return (
    <section>
      <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-foreground/90">
        {value}
      </p>
    </section>
  );
}

export function DevotionComposer({
  action,
  initialValues = EMPTY_VALUES,
  mode = "create",
}: DevotionComposerProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialDevotionFormState,
  );
  const [scriptureReference, setScriptureReference] = useState(
    initialValues.scriptureReference,
  );
  const [scriptureInputKey, setScriptureInputKey] = useState(0);
  const [scriptureText, setScriptureText] = useState(initialValues.scriptureText);
  const [observation, setObservation] = useState(initialValues.observation);
  const [application, setApplication] = useState(initialValues.application);
  const [prayer, setPrayer] = useState(initialValues.prayer);
  const [visibility, setVisibility] = useState<Visibility>(
    initialValues.visibility,
  );

  const hasContent = useMemo(
    () =>
      [
        scriptureReference,
        scriptureText,
        observation,
        application,
        prayer,
      ].some((value) => value.trim().length > 0),
    [scriptureReference, scriptureText, observation, application, prayer],
  );

  function clearComposer() {
    setScriptureReference("");
    setScriptureInputKey((value) => value + 1);
    setScriptureText("");
    setObservation("");
    setApplication("");
    setPrayer("");
    setVisibility(initialValues.visibility);
  }

  return (
    <form
      action={formAction}
      className="grid gap-6 xl:grid-cols-[minmax(0,720px)_320px] xl:items-start xl:justify-center"
    >
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                {mode === "create" ? "New Devotion" : "Edit Devotion"}
              </p>
              <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
                Scripture. Observation. Application. Prayer.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Write enough to be honest and useful. A devotion does not need
                to be long to be meaningful.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="size-4 text-devotion-sage" />
              Live preview
            </div>
          </div>
        </div>

        <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-7">
          <EditorSection
            number="01"
            title="Scripture"
            description="Start with the passage you are reflecting on today."
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">Reference</p>
                  <Counter value={scriptureReference} max={MAX_REFERENCE} />
                </div>
                <ScriptureReferenceInput
                  key={scriptureInputKey}
                  value={scriptureReference}
                  onChange={setScriptureReference}
                  maxLength={MAX_REFERENCE}
                  ariaDescribedBy={
                    state.errors?.scriptureReference
                      ? "scripture-reference-error"
                      : undefined
                  }
                />
                <FieldError id="scripture-reference-error">
                  {state.errors?.scriptureReference}
                </FieldError>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="scripture-text">Scripture text</Label>
                  <Counter value={scriptureText} max={MAX_SCRIPTURE} />
                </div>
                <Textarea
                  id="scripture-text"
                  name="scriptureText"
                  value={scriptureText}
                  maxLength={MAX_SCRIPTURE}
                  onChange={(event) => setScriptureText(event.target.value)}
                  className="scripture min-h-32 text-base leading-7"
                  placeholder="Paste or type the passage here..."
                  aria-invalid={Boolean(state.errors?.scriptureText)}
                  aria-describedby={
                    state.errors?.scriptureText
                      ? "scripture-text-error"
                      : undefined
                  }
                />
                <FieldError id="scripture-text-error">
                  {state.errors?.scriptureText}
                </FieldError>
              </div>
            </div>
          </EditorSection>

          <EditorSection
            number="02"
            title="Observation"
            description="What stands out? What does the passage reveal about God, people, or the situation?"
          >
            <div className="grid gap-2">
              <div className="flex justify-end">
                <Counter value={observation} max={MAX_SECTION} />
              </div>
              <Textarea
                id="observation"
                name="observation"
                value={observation}
                maxLength={MAX_SECTION}
                onChange={(event) => setObservation(event.target.value)}
                className="min-h-44"
                placeholder="Write what you notice before trying to solve or apply it..."
                aria-invalid={Boolean(state.errors?.observation)}
                aria-describedby={
                  state.errors?.observation ? "observation-error" : undefined
                }
                required
              />
              <FieldError id="observation-error">
                {state.errors?.observation}
              </FieldError>
            </div>
          </EditorSection>

          <EditorSection
            number="03"
            title="Application"
            description="Turn the reflection into one concrete response you can carry into your day."
          >
            <div className="grid gap-2">
              <div className="flex justify-end">
                <Counter value={application} max={MAX_SECTION} />
              </div>
              <Textarea
                id="application"
                name="application"
                value={application}
                maxLength={MAX_SECTION}
                onChange={(event) => setApplication(event.target.value)}
                className="min-h-40"
                placeholder="How will you live this out today?"
                aria-invalid={Boolean(state.errors?.application)}
                aria-describedby={
                  state.errors?.application ? "application-error" : undefined
                }
                required
              />
              <FieldError id="application-error">
                {state.errors?.application}
              </FieldError>
            </div>
          </EditorSection>

          <EditorSection
            number="04"
            title="Prayer"
            description="Respond personally. Keep it direct, honest, and connected to what you just read."
          >
            <div className="grid gap-2">
              <div className="flex justify-end">
                <Counter value={prayer} max={MAX_SECTION} />
              </div>
              <Textarea
                id="prayer"
                name="prayer"
                value={prayer}
                maxLength={MAX_SECTION}
                onChange={(event) => setPrayer(event.target.value)}
                className="min-h-40"
                placeholder="Write your prayer..."
                aria-invalid={Boolean(state.errors?.prayer)}
                aria-describedby={
                  state.errors?.prayer ? "prayer-error" : undefined
                }
                required
              />
              <FieldError id="prayer-error">{state.errors?.prayer}</FieldError>
            </div>
          </EditorSection>

          <EditorSection
            number="05"
            title="Visibility"
            description="Choose whether this devotion will be shared with the community or kept in your private journal."
          >
            <input type="hidden" name="visibility" value={visibility} />
            <div
              role="group"
              aria-label="Devotion visibility"
              aria-describedby={
                state.errors?.visibility ? "visibility-error" : undefined
              }
              className="grid gap-3 sm:grid-cols-2"
            >
              <button
                type="button"
                aria-pressed={visibility === "PUBLIC"}
                onClick={() => setVisibility("PUBLIC")}
                className={cn(
                  "min-h-24 rounded-md border p-4 text-left transition-colors",
                  visibility === "PUBLIC"
                    ? "border-primary/70 bg-primary/5"
                    : "border-border bg-background hover:bg-accent",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe2
                    className={cn(
                      "size-4",
                      visibility === "PUBLIC"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  Public
                </span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  Appears in the community feed and on your public profile.
                </span>
              </button>

              <button
                type="button"
                aria-pressed={visibility === "PRIVATE"}
                onClick={() => setVisibility("PRIVATE")}
                className={cn(
                  "rounded-md border p-4 text-left transition-colors",
                  visibility === "PRIVATE"
                    ? "border-primary/70 bg-primary/5"
                    : "border-border bg-background hover:bg-accent",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Lock
                    className={cn(
                      "size-4",
                      visibility === "PRIVATE"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  Private
                </span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  Saved only to your personal devotion journal.
                </span>
              </button>
            </div>
            <FieldError id="visibility-error">
              {state.errors?.visibility}
            </FieldError>
          </EditorSection>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={clearComposer}
            disabled={!hasContent || pending}
            className="w-full gap-2 sm:w-auto"
          >
            <RotateCcw className="size-4" />
            Clear
          </Button>

          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending
                ? mode === "create"
                  ? "Posting..."
                  : "Saving..."
                : mode === "create"
                  ? "Post devotion"
                  : "Save changes"}
            </Button>
            {state.message ? (
              <p
                className="text-[11px] text-destructive"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                {visibility === "PUBLIC"
                  ? "This devotion will be visible in the community feed."
                  : "This devotion will stay in your private journal."}
              </p>
            )}
          </div>
        </div>
      </div>

      <aside className="xl:sticky xl:top-20">
        <div className="rounded-lg border border-border bg-sidebar">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <BookOpenText className="size-4 text-primary" />
              <p className="text-xs font-medium tracking-[0.16em] text-foreground uppercase">
                Preview
              </p>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {visibility === "PUBLIC" ? "Public" : "Private"}
            </span>
          </div>

          <div className="p-5">
            <div className="border-l-2 border-primary/70 pl-4">
              <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
                {scriptureReference.trim() || "Scripture reference"}
              </p>
              <blockquote
                className={cn(
                  "scripture mt-3 text-xl leading-8",
                  scriptureText.trim()
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {scriptureText.trim()
                  ? `“${scriptureText}”`
                  : "Your selected Scripture will appear here."}
              </blockquote>
            </div>

            <div className="mt-7 space-y-7">
              <PreviewSection label="Observation" value={observation} />
              <PreviewSection label="Application" value={application} />
              <PreviewSection label="Prayer" value={prayer} />

              {!observation.trim() &&
              !application.trim() &&
              !prayer.trim() ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Start writing to see how the devotion will read when shared.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 border-l-2 border-devotion-sage pl-4">
          <p className="text-xs font-medium tracking-[0.16em] text-devotion-sage uppercase">
            Writing reminder
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            The goal is not to sound impressive. Write clearly enough that you
            can return later and remember what you saw, decided, and prayed.
          </p>
        </div>
      </aside>
    </form>
  );
}
