import { registerComponent } from "@/utils/register-component.util";
import { memo, useState, type FC } from "react";
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import Animated from "react-native-reanimated";
import type {
  ITableBlock,
  TDelayedAnimation,
  TTableRow,
  TWord,
} from "./interface";
import { delayed, enter } from "./utils/animation.util";
import { fitColumns, justify } from "./utils/style.util";
import { Words } from "./words";

const TableBlockBase: FC<ITableBlock> = ({
  block,
  scheduled,
  timing,
  delay,
  theme,
  onLinkPress,
  style,
}: ITableBlock & React.ComponentProps<typeof TableBlockBase>): React.ReactNode &
  React.JSX.Element => {
  const [animation] = useState<TDelayedAnimation | undefined>(
    (): TDelayedAnimation | undefined => delayed(enter, delay),
  );
  const [available, setAvailable] = useState<number>(0);
  const widths: number[] = fitColumns(block.widths, available);
  const done: boolean = scheduled >= block.end;
  const rows: TTableRow[] = block.rows.filter(
    (row: TTableRow): boolean => done || row.start < scheduled,
  );

  return (
    <Animated.View
      style={[style, styles.table, { borderColor: theme.border }, animation]}
      onLayout={(e: LayoutChangeEvent): void =>
        setAvailable(e.nativeEvent.layout.width - StyleSheet.hairlineWidth * 2)
      }
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {rows.map(
            (row: TTableRow, r: number): React.JSX.Element => (
              <View
                key={r}
                style={[
                  styles.row,
                  r === 0
                    ? { backgroundColor: theme.tableHeader }
                    : {
                        borderTopColor: theme.border,
                        borderTopWidth: StyleSheet.hairlineWidth,
                      },
                ]}
              >
                {widths.map(
                  (width: number, c: number): React.JSX.Element => (
                    <View key={c} style={[styles.cell, { width }]}>
                      <Words
                        words={(row.cells[c] ?? []).filter(
                          (w: TWord): boolean => w.id < scheduled,
                        )}
                        variant={r === 0 ? theme.headerCell : theme.cell}
                        timing={timing}
                        theme={theme}
                        onLinkPress={onLinkPress}
                        style={{ justifyContent: justify(block.align[c]) }}
                      />
                    </View>
                  ),
                )}
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderRadius: 12,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: { flexDirection: "row" },
  cell: { paddingHorizontal: 12, paddingVertical: 9 },
});

const TableBlock = registerComponent("TableBlock", memo(TableBlockBase));

export { TableBlock };
