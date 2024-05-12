"use client";

import { Event, EventType, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Card from "../cards/Card";

type FullEvent = Event & {
  Company: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    socialLink: string | null;
    userId: string;
    isAccepted: boolean;
  } | null;
  type: {
    id: string;
    value: string;
  };
  users: User[];
};

type PropTypes = {
  types: EventType[];
  events: FullEvent[];
};

const EventList = ({ types, events }: PropTypes) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortedEvents, setSortedEvents] = useState<FullEvent[]>(events);

  useEffect(() => {
    const filteredEvents = events.filter((ev) => {
        const eventDate = new Date(ev.date ?? "").toISOString().split('T')[0];

        if (selectedType.length && selectedDate.length) {
            return ev.type.id === selectedType && eventDate === selectedDate;
        } else if (selectedType.length) {
            return ev.type.id === selectedType;
        } else if (selectedDate.length) {
            return eventDate === selectedDate;
        } else {
            return true;
        }
    });

    setSortedEvents(filteredEvents);
}, [selectedType, selectedDate, events]);

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-6 mt-4">
          {types.map((type) => (
            <button
              onClick={() => setSelectedType(type.id)}
              className={`${
                selectedType === type.id ? "text-blue-500" : "text-gray-900"
              } text-xl hover:bg-gray-300 hover:rounded-2xl px-2 py-1`}
              key={type.id}
            >
              {type.value}
            </button>
          ))}
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {sortedEvents.length ? sortedEvents.map((event) => (
          <Card
            key={event.id}
            event={event}
            company={event.Company ?? undefined}
            type={event.type}
          ></Card>
        )) : <section className="w-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
              404
            </h1>
            <p className="mb-4 text-2xl tracking-tight font-bold text-gray-900">
              Событий с заданными фильтрами не найдено
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 ">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        </div>
      </section>}
      </div>
    </div>
  );
};

export default EventList;
