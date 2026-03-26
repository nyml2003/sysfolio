import type { ReactNode } from 'react';

import type { OverviewDemoId } from '../overview-copy';
import { AppShellDemo } from './demos/app-shell.demo';
import { ButtonDemo } from './demos/button.demo';
import { HeadingDemo } from './demos/heading.demo';
import { LabelDemo } from './demos/label.demo';
import { TextDemo } from './demos/text.demo';
import { LinkDemo } from './demos/link.demo';
import { CodeBlockSurfaceDemo } from './demos/code-block-surface.demo';
import { SearchInputDemo } from './demos/search-input.demo';
import { NumberInputDemo } from './demos/number-input.demo';
import { DesignGapsDemo } from './demos/design-gaps.demo';
import { FieldInputDemo } from './demos/field-input.demo';
import { LayoutPrimitivesDemo } from './demos/layout-primitives.demo';
import { MissingComponentsDemo } from './demos/missing-components.demo';
import { PreferenceControlsDemo } from './demos/preferences.demo';
import { StyleProviderDemo } from './demos/style-provider.demo';
import { ThemeDensityDemo } from './demos/theme-density.demo';
import { TokensDemo } from './demos/tokens.demo';
import { TreeNavDemo } from './demos/tree-nav.demo';
import { ViewStateLayoutDemo } from './demos/view-state-layout.demo';

export const overviewDemoRenderers: Record<OverviewDemoId, () => ReactNode> = {
  'style-provider': () => <StyleProviderDemo />,
  preferences: () => <PreferenceControlsDemo />,
  tokens: () => <TokensDemo />,
  'theme-density': () => <ThemeDensityDemo />,
  'layout-primitives': () => <LayoutPrimitivesDemo />,
  'app-shell': () => <AppShellDemo />,
  button: () => <ButtonDemo />,
  heading: () => <HeadingDemo />,
  label: () => <LabelDemo />,
  text: () => <TextDemo />,
  link: () => <LinkDemo />,
  'code-block-surface': () => <CodeBlockSurfaceDemo />,
  'search-input': () => <SearchInputDemo />,
  'number-input': () => <NumberInputDemo />,
  'field-input': () => <FieldInputDemo />,
  'tree-nav': () => <TreeNavDemo />,
  'view-state-layout': () => <ViewStateLayoutDemo />,
  'missing-components': () => <MissingComponentsDemo />,
  'design-gaps': () => <DesignGapsDemo />,
};
