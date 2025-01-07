import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface ItemCardProps {
  title?: string;
  itemId: string;
  className?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ title, className, itemId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: itemId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const dragProps = {
    ref: setNodeRef,
    style,
    ...listeners,
    ...attributes,
  };

  return (
    <div
      className={cn(
        "border border-black-100 rounded-[4px] bg-black-400 w-[298px] relative p-4",
        isDragging ? "z-50" : "z-10",
        className
      )}
      {...dragProps}
    >
      <h2 className="font-semibold text-sm leading-6">{title}</h2>
    </div>
  );
};

export default ItemCard;
