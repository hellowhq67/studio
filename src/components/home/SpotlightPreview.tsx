import React from 'react';
import {cn} from '@/lib/utils';
import {Spotlight} from '../ui/spotlight';
import {BackgroundBeams} from '../ui/background-beams';
import { Button } from '../ui/button';
import Link from 'next/link';

export function SpotlightPreview() {
  return (
    <div className="relative flex h-[40rem] w-full overflow-hidden rounded-md bg-background antialiased md:items-center md:justify-center">
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Evanie Glow
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
         Discover your inner radiance with our exquisite collection of cosmetics.
        </p>
         <div className="flex justify-center mt-8">
            <Button asChild>
                <Link href="/products">Shop Now</Link>
            </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
