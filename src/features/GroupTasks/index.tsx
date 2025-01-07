import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import GroupItemCard, { GroupItemCardProps } from "./components/GroupItemCard";
import { ColumnType } from "@/types/columns";

export default function GroupTasks() {
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      id: "available-options",
      title: "Available Options",
      items: [
        {
          id: "sales-cloud",
          title: "Sales Cloud",
        },
        {
          id: "service-cloud",
          title: "Service Cloud",
        },
        {
          id: "community-cloud",
          title: "Community Cloud",
        },
        {
          id: "financial-cloud",
          title: "Financial Cloud",
        },
        {
          id: "einstein-ai",
          title: "Einstein AI",
        },
        {
          id: "wave-analytics",
          title: "Wave Analytics",
        },
        {
          id: "health-cloud",
          title: "Health Cloud",
        },
      ],
    },
    {
      id: "selected-options",
      title: "Selected Options",
      items: [],
    },
  ]);

  const findColumn = (uniqueId: string | null) => {
    if (!uniqueId) {
      return null;
    }
    if (columns.some((column) => column.id === uniqueId)) {
      return columns.find((column) => column.id === uniqueId) ?? null;
    }
    const id = String(uniqueId);
    const itemWithColumnId = columns.flatMap((column) => {
      const columnId = column.id;
      return column.items.map((item) => ({
        itemId: item.id,
        columnId: columnId,
      }));
    });
    const columnId = itemWithColumnId.find(
      (item) => item.itemId === id
    )?.columnId;
    return columns.find((column) => column.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    setColumns((prevState) => {
      const activeItems = activeColumn.items;
      const overItems = overColumn.items;
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((column) => {
        if (column.id === activeColumn.id) {
          column.items = activeItems.filter((item) => item.id !== activeId);
          return column;
        } else if (column.id === overColumn.id) {
          column.items = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length),
          ];
          return column;
        } else {
          return column;
        }
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.items.findIndex(
      (item) => item.id === activeId
    );
    const overIndex = overColumn.items.findIndex((item) => item.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.items = arrayMove(overColumn.items, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getVariant = useCallback(
    (index: number): GroupItemCardProps["variant"] => {
      const variants: GroupItemCardProps["variant"][] = ["primary", "warning"];

      return variants[index];
    },
    []
  );

  return (
    <div className="flex p-4 gap-3 max-w-screen-2xl mx-auto py-6 overflow-x-auto 2xl:px-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {columns.map((column, idx) => (
          <GroupItemCard
            key={column.id}
            id={column.id}
            title={column.title}
            items={column.items}
            groupId={column.id}
            variant={getVariant(idx)}
          />
        ))}
      </DndContext>
    </div>
  );
}
