import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Slider } from '@components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

type Data = ReturnType<typeof generateItems>;

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    text: `Item ${index}`,
    description: `This is a description for item ${index}. ${
      Math.random() > 0.7 ? 'It has some extra text to make it taller.' : ''
    }`,
    bgColor: index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
  }));
};

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

const ListItem = ({
  item,
}: {
  item: { id: number; text: string; description: string; bgColor: string };
}) => (
  <div className={`p-4 border-b ${item.bgColor}`}>
    <div className="font-medium">{item.text}</div>
    <div className="text-sm text-gray-500">{item.description}</div>
  </div>
);

const WindowedListItem = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: Data;
}) => {
  const item = data[index];
  return (
    <div style={style} className={`p-4 border-b ${item.bgColor}`}>
      <div className="font-medium">{item.text}</div>
      <div className="text-sm text-gray-500">{item.description}</div>
    </div>
  );
};

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [itemCount, setItemCount] = useState(1000);
  const [items, setItems] = useState(() => generateItems(itemCount));
  const [activeTab, setActiveTab] = useState('comparison');
  const regularListRef = useRef<HTMLDivElement>(null);
  const windowedListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(generateItems(itemCount));
  }, [itemCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Windowing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="item-count" className="text-sm font-medium">
              Item Count: {itemCount.toLocaleString()}
            </label>

            <Slider
              id="item-count"
              min={100}
              max={10000}
              step={100}
              value={[itemCount]}
              onValueChange={(value) => setItemCount(value[0])}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Side by Side</TabsTrigger>
            <TabsTrigger value="regular">Regular List</TabsTrigger>
            <TabsTrigger value="windowed">Windowed List</TabsTrigger>
          </TabsList>
          <TabsContent value="comparison" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Regular List</CardTitle>
                  <CardDescription>
                    Renders all {itemCount.toLocaleString()} items at once
                  </CardDescription>
                </CardHeader>
                <div className="border-t" ref={regularListRef}>
                  <div className="h-[400px] overflow-auto">
                    {items.map((item) => (
                      <ListItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Windowed List</CardTitle>
                  <CardDescription>Only renders visible items</CardDescription>
                </CardHeader>
                <div className="border-t" ref={windowedListRef}>
                  <div className="h-[400px]">
                    <FixedSizeList
                      height={400}
                      width="100%"
                      itemCount={items.length}
                      itemSize={70}
                      itemData={items}
                    >
                      {WindowedListItem}
                    </FixedSizeList>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="regular" className="mt-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Regular List</CardTitle>
                <CardDescription>
                  Renders all {itemCount.toLocaleString()} items at once
                </CardDescription>
              </CardHeader>
              <div className="border-t" ref={regularListRef}>
                <div className="h-[600px] overflow-auto">
                  {items.map((item) => (
                    <ListItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="windowed" className="mt-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Windowed List</CardTitle>
                <CardDescription>Only renders visible items</CardDescription>
              </CardHeader>
              <div className="border-t" ref={windowedListRef}>
                <div className="h-[600px]">
                  <FixedSizeList
                    height={600}
                    width="100%"
                    itemCount={items.length}
                    itemSize={70}
                    itemData={items}
                  >
                    {WindowedListItem}
                  </FixedSizeList>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
