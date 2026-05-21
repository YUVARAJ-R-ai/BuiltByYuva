// FIX: Added missing import for React.
import React from 'react';

// FIX: Added the missing 'AspectRatio' enum to resolve import errors.
export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16',
}

export interface Skill {
  name: string;
  Icon: React.ElementType;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export interface Achievement {
  date: string;
  title:string;
  description: string;
}