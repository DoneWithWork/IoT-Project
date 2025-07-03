import { cn } from '@/lib/utils';
import React, { ReactNode, HTMLAttributes } from 'react';

type HeaderType = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
  classnames?:string;
};

export default function Header({classnames, children, ...rest }: HeaderType) {
  return <h1 className={cn("text-2xl font-bold",classnames)} {...rest}>{children}</h1>;
}
