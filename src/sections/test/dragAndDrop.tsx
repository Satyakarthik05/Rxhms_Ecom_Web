import type React from "react";
import { useState } from "react";
import { useFetchByQuery } from "../../customHooks/hooks";
import type { MenuGroup, MenuResponse } from "./model/textModel";
import { uri } from "./service.ts/testServiceConstants";

export const DragAndDrop = () => {
  const { data, isLoading, error } = useFetchByQuery<MenuResponse>(uri, {
    channelId: 1,
  });

  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, title: string) => {
    e.dataTransfer.setData("text/plain", title);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const title = e.dataTransfer.getData("text/plain");
    console.log("Dropped:", title);
    setDroppedItems((prev) => [...prev, title]);
  };

  const menuGroups = data?.content?.menuGroups || null;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {menuGroups !== null && menuGroups.length > 0 ? (
        <div className="titles">
          {menuGroups.map((each: MenuGroup, index: number) => (
            <>
              <span
                key={index}
                draggable={true}
                className="span-title"
                onDragStart={(e) => handleDragStart(e, each.title)}
              >
                {each.title}
              </span>
              <br />
            </>
          ))}
        </div>
      ) : (
        <span>No menu groups available</span>
      )}

      <div
        style={{
          minWidth: "200px",
          maxWidth: "500px",
          minHeight: "200px",
          margin: "20px auto",
          padding: "10px",
        }}
        className="bg-primary basket"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {droppedItems.length === 0 ? (
          <p className="text-center text-primary-foreground">Drop items here</p>
        ) : (
          droppedItems.map((item, index) => (
            <div key={index} className="bg-white text-black p-2 mb-2 rounded">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
