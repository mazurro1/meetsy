interface useOuterClickProps {
  refElement: React.RefObject<any>;
  handleOpen: (value: boolean) => void;
}

export default function useOuterClick({
  refElement,
  handleOpen,
}: useOuterClickProps) {
  return () => {
    if (!refElement.current) return;
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(`click`, (evt) => {
        const cur = refElement.current;
        const node = evt.target;
        if (!cur) return;
        if (cur.contains(node)) return;
        handleOpen(false);
      });
    });
  };
}
