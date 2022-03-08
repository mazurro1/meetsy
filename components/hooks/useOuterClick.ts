interface useOuterClickProps {
  refElement: React.RefObject<any>;
  setIsOpen: (value: boolean) => void;
}

export default function useOuterClick({
  refElement,
  setIsOpen,
}: useOuterClickProps) {
  return () => {
    if (!refElement.current) return;
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(`click`, (evt) => {
        const cur = refElement.current;
        const node = evt.target;
        if (!cur) return;
        if (cur.contains(node)) return;
        setIsOpen(false);
      });
    });
  };
}
