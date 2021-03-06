import React from "react"
import { noopTemplate as css } from "lib/utils"
import Typography, { TypographyProps } from "@material-ui/core/Typography"

export type TextProps = TypographyProps & {
  component?: React.ElementType
}

export default (props: TextProps) => {
  return <Typography {...props} color={props.color || "textPrimary"} />
}
