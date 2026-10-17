import { useForm } from "react-hook-form";
import { TextInput } from "@/shared/ui/TextInput/TextInput";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./FeedNameForm.module.css";

interface FeedNameFormProps {
  initialName: string;
  validate: (name: string) => string;
  onSave: (name: string) => void;
  onCancel: () => void;
  editing: boolean;
  onDelete: () => void;
}

export const FeedNameForm = ({
  initialName,
  validate,
  onSave,
  onCancel,
  editing,
  onDelete,
}: FeedNameFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({ defaultValues: { name: initialName } });

  return (
    <form
      className={styles.form}
      onSubmit={(event) =>
        void handleSubmit(({ name }: { name: string }) => onSave(name))(event)
      }
    >
      <TextInput
        id="feed-name"
        label="Feed name"
        placeholder="e.g. Technology news"
        data-autofocus
        {...register("name", {
          validate: (value: string) => validate(value) || true,
        })}
        error={errors.name?.message}
      />
      <div className={styles.actions}>
        {editing && (
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};
