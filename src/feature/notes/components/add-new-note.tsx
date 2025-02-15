import { useCallback, useState } from "react";

import { Loader } from "lucide-react";
import { toast } from "sonner";

import AutosizeTextarea from "@/components/shared/auto-resize-text-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useVideoPlayer } from "@/feature/video-view/provider/video-player.provider";
import { api } from "@/trpc/client";

type Props = {
  videoId: string;
};

const AddNewNote = ({ videoId }: Props) => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [content, setContent] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const playRef = useVideoPlayer((state) => state.player);
  const utils = api.useUtils();

  const handleToggle = useCallback(() => {
    setIsAddNoteOpen((prev) => !prev);
  }, []);

  const createMutation = api.notes.createNote.useMutation({
    onSuccess: (res) => {
      utils.notes.getNotesByVideoId.setData(videoId, (prev) => {
        if (!prev) return [res];
        return [res, ...prev];
      });
      setContent("");
      setHasEdited(false);
      setIsAddNoteOpen(false);
      toast.success("Note added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSaveNote = useCallback(() => {
    createMutation.mutate({
      videoId,
      content,
      timestamp: playRef?.getCurrentTime() || 0,
    });
  }, [content, createMutation, playRef, videoId]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      setHasEdited(true);
    },
    []
  );

  return (
    <div className="mb-2 mt-3">
      {!isAddNoteOpen && (
        <div className="flex justify-end">
          <Button size={"sm"} onClick={handleToggle}>
            Add Note
          </Button>
        </div>
      )}
      {isAddNoteOpen && (
        <div className="mt-6">
          <div className="group relative">
            <Label className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
              Start writing
            </Label>
            <AutosizeTextarea
              maxHeight={500}
              minHeight={208}
              className="pb-9"
              onChange={handleContentChange}
              placeholder="Write your note here..."
              disabled={createMutation.isPending}
            />
            <div className="absolute bottom-2 right-2 flex flex-row justify-end gap-2">
              <Button
                onClick={handleToggle}
                variant={"secondary"}
                className="h-8"
                size="sm"
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={onSaveNote}
                disabled={createMutation.isPending}
                className="h-8"
                size="sm"
              >
                {createMutation.isPending ? (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewNote;
