import { useCallback, useRef, useState } from "react";

import { Loader, PencilIcon, TrashIcon } from "lucide-react";

import AutosizeTextarea, {
  AutosizeTextAreaRef,
} from "@/components/shared/auto-resize-text-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/client";

type Props = {
  videoId: string;
  note: RouterOutputs["notes"]["getNotesByVideoId"][number];
  handleDelete: (id: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditAndViewNotes = ({ videoId, note, handleDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<AutosizeTextAreaRef>(null);
  const [hasEdited, setHasEdited] = useState(false);
  const [content, setContent] = useState(note.content);

  const toggleEditing = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      ref.current?.textArea.focus();
    }
  }, [isEditing]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      setHasEdited(true);
    },
    []
  );

  return (
    <div className="relative">
      {!isEditing && (
        <div className="absolute -top-4 right-2 space-x-1">
          <Button
            className="size-8 rounded-full"
            variant="destructive"
            size={"sm"}
            onClick={() => handleDelete(note.id)}
          >
            <TrashIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">delete note</span>
          </Button>
          <Button
            className="size-8 rounded-full bg-emerald-600 dark:bg-emerald-400"
            size={"sm"}
            onClick={toggleEditing}
          >
            <PencilIcon
              size={16}
              className="text-emerald-950"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="sr-only">edit note</span>
          </Button>
        </div>
      )}
      <AutosizeTextarea
        ref={ref}
        className={cn(
          "read-only:bg-muted",
          isEditing ? "resize-y" : "resize-none"
        )}
        value={content}
        onChange={handleContentChange}
        readOnly={!isEditing}
        placeholder="Add your note here"
        minHeight={isEditing ? 208 : 0}
        maxHeight={500}
      />
      {isEditing && (
        <div className="absolute bottom-2 right-2 flex flex-row justify-end gap-2">
          <Button
            onClick={toggleEditing}
            variant={"secondary"}
            className="h-8"
            size="sm"

            // disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            // onClick={onSaveNote}
            // disabled={createMutation.isPending}
            className="h-8"
            size="sm"
          >
            {false ? (
              <>
                <Loader className="animate-spin text-muted" /> saving...
              </>
            ) : hasEdited ? (
              "unsaved"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditAndViewNotes;
