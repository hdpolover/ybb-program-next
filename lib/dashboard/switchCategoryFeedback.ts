import { toast } from "sonner";

const SWITCH_CATEGORY_FEEDBACK_KEY = "ybb_switch_category_feedback";

type FeedbackType = "success" | "info" | "error";

type SwitchCategoryFeedback = {
  type: FeedbackType;
  message: string;
};

export function queueSwitchCategoryFeedback(type: FeedbackType, message: string) {
  if (typeof window === "undefined") return;
  try {
    const payload: SwitchCategoryFeedback = { type, message };
    window.sessionStorage.setItem(SWITCH_CATEGORY_FEEDBACK_KEY, JSON.stringify(payload));
  } catch {
    // no-op: toast will just not survive reload
  }
}

export function flushSwitchCategoryFeedback() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SWITCH_CATEGORY_FEEDBACK_KEY);
    if (!raw) return;
    window.sessionStorage.removeItem(SWITCH_CATEGORY_FEEDBACK_KEY);
    const payload = JSON.parse(raw) as Partial<SwitchCategoryFeedback>;
    const message = typeof payload.message === "string" ? payload.message : "";
    const type = payload.type;
    if (!message) return;

    if (type === "success") {
      toast.success(message);
      return;
    }
    if (type === "info") {
      toast(message);
      return;
    }
    if (type === "error") {
      toast.error(message);
      return;
    }
  } catch {
    window.sessionStorage.removeItem(SWITCH_CATEGORY_FEEDBACK_KEY);
  }
}
