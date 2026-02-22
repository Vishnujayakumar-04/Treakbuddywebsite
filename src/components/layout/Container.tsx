
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className,
    as: Component = 'div',
    ...props
}) => {
    return (
        <Component
            className={cn(
                "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    id?: string;
}

export const Section: React.FC<SectionProps> = ({
    children,
    className,
    id,
    ...props
}) => {
    return (
        <section
            id={id}
            className={cn(
                "py-12 md:py-16 lg:py-24 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
};
