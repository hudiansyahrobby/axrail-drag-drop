import React from "react";

import Badge from "@/components/ui/Badge";
import { useDroppable } from "@dnd-kit/core";
import { cva, type VariantProps } from "class-variance-authority";

import ItemCard from "./ItemCard";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Item } from "@/types/items";
import { cn } from "@/lib/utils";

const groupItemCardVariants = cva("p-4 border rounded-[4px]", {
  variants: {
    variant: {
      primary: "border-primary bg-primary-50",
      warning: "border-warning bg-warning-50",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface GroupItemCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof groupItemCardVariants> {
  title: string;
  groupId: string;
  items: Item[];
}

const GroupItemCard = ({
  className,
  variant,
  title,
  groupId,
  items,
  ...props
}: GroupItemCardProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: groupId });

  return (
    <SortableContext id={groupId} items={items} strategy={rectSortingStrategy}>
      <div
        className={cn(
          groupItemCardVariants({ variant }),
          "flex flex-col gap-3 items-start w-[326px] shrink-0 grow-0 h-fit",
          isOver ? "bg-white" : "",
          className
        )}
        ref={setNodeRef}
        {...props}
      >
        <Badge variant={variant}>{title}</Badge>

        {items && items?.length > 0
          ? items?.map((item) => (
              <ItemCard key={item.id} itemId={item.id} title={item.title} />
            ))
          : null}
      </div>
    </SortableContext>
  );
};

export default GroupItemCard;
