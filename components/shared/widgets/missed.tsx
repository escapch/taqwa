'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Missed: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
        <div className="text-6xl font-bold">Missed</div>
        
    </div>
  );
}