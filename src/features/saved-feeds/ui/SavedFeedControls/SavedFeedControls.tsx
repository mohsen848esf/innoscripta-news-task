import { Modal } from "@/shared/ui/Modal/Modal";
import { SelectInput } from "@/shared/ui/SelectInput/SelectInput";
import { Button } from "@/shared/ui/Button/Button";
import type { Search } from "@/entities/news/model/types";
import { useSavedFeedControls } from "../../model/useSavedFeedControls";
import { FeedNameForm } from "../FeedNameForm/FeedNameForm";
import styles from "./SavedFeedControls.module.css";

interface SavedFeedControlsProps {
  search: Search;
  onSelect: (search: Search) => void;
}

export const SavedFeedControls = ({
  search,
  onSelect,
}: SavedFeedControlsProps) => {
  const controls = useSavedFeedControls(search, onSelect);

  return (
    <section className={styles.wrapper} aria-label="Saved feeds">
      <div className={styles.toolbar}>
        <SelectInput
          id="saved-feed"
          label="Saved feeds"
          className={styles.picker}
          value={controls.selectedId}
          options={[
            { value: "", label: "Current search" },
            ...controls.saved.feeds.map((feed) => ({
              value: feed.id,
              label: feed.name,
            })),
          ]}
          onChange={(event) => controls.select(event.target.value)}
        />
        <Button
          disabled={controls.disabled}
          onClick={() => controls.setModal("new")}
        >
          Save as feed
        </Button>
        <Button
          disabled={!controls.selected || controls.disabled}
          onClick={() => controls.setModal("edit")}
        >
          Edit feed
        </Button>
      </div>
      {controls.changed && (
        <p className={styles.hint}>This feed has unsaved changes.</p>
      )}
      {controls.saved.error && !controls.modal && (
        <div role="alert" className={styles.error}>
          <p>{controls.saved.error}</p>
          {controls.saved.readError && (
            <Button onClick={controls.reset}>Reset saved data</Button>
          )}
        </div>
      )}
      {controls.notice && (
        <p role="status" className={styles.hint}>
          {controls.notice}
        </p>
      )}
      {controls.modal && (
        <Modal
          title={
            controls.modal === "edit" ? "Edit saved feed" : "Save this search"
          }
          onClose={() => controls.setModal(null)}
        >
          <FeedNameForm
            initialName={
              controls.modal === "edit" ? (controls.selected?.name ?? "") : ""
            }
            validate={controls.validateName}
            onSave={controls.saveName}
            onCancel={() => controls.setModal(null)}
            editing={controls.modal === "edit"}
            onDelete={controls.remove}
          />
          {controls.saved.error && (
            <p className={styles.error} role="alert">
              {controls.saved.error}
            </p>
          )}
        </Modal>
      )}
    </section>
  );
};
