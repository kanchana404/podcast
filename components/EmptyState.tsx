import { EmptyStateProps } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyState = ({
  title,
  search,
  buttonText,
  buttonLink,
}: EmptyStateProps) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image
        src="/icons/emptyState.svg"
        width={250}
        height={250}
        alt="emptyState"
      />

      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white-1">
          {title}
        </h1>
        {search && (
            <p className="text-16 text-center font-medium font-white-2">Try adjusting your search to find what you are looking for.</p>
        )}

        {buttonText && (
            <Button className="bg-orange-1">
                <Link href='/discover' className="gap-1 flex">
                <Image
                src="/icons/discover.svg"
                width={20}
                height={20}
                alt="discover"
                />
                <h1 className="text-16 font-extrabold text-white-1">{buttonText}</h1>
                </Link>
            </Button>
        )}
      </div>
    </section>
  );
};

export default EmptyState;
