import { none } from '@/shared/lib/monads/option';
import type { HeadingOwnProps } from '@/shared/ui/primitives';

/** 各 *demo.tsx 中小节标题共用字段（非组件；页面层只放数据，UI 用原语 Heading 拼装）。 */
export const overviewDemoSectionHeadingBase: Pick<HeadingOwnProps, 'leadingIcon' | 'trailingMeta'> =
  {
    leadingIcon: none(),
    trailingMeta: none(),
  };
