import { SymbolView } from "expo-symbols";
import type { FC } from "react";

import {
  ICON_DEFAULT_SIZE,
  ICON_GLYPHS,
} from "@/constants/components/icon.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IIcon } from "./interface";

const IconBase: FC<IIcon> = ({
  name,
  color,
  size = ICON_DEFAULT_SIZE,
  style,
}: IIcon & React.ComponentProps<typeof IconBase>): React.ReactNode &
  React.JSX.Element => (
  <SymbolView
    name={ICON_GLYPHS[name]}
    size={size}
    tintColor={color}
    style={style}
  />
);

const Icon = registerComponent("Icon", IconBase);

export { Icon };
