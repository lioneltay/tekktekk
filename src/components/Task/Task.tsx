import React from "react"
import { noopTemplate as css } from "lib/utils"
import { styled } from "theme"
import { useTheme } from "theme"

import { ListItem, ListItemIcon, Fab } from "@material-ui/core"

import { ListItemText } from "lib/components"

import { Assignment } from "@material-ui/icons"
import { useGesture } from "lib/useGesture"

const StyledListItem = styled(ListItem)`
  position: relative;
  min-height: 70px;
` as any

const Overlay = styled.div`
  opacity: 0;
  pointer-events: none;
  display: none;

  body.hasHover ${StyledListItem}:hover & {
    display: flex;
    opacity: 1;
    pointer-events: all;
  }
`

export type TaskProps = Stylable & {
  selected: boolean
  task: Task
  multiselect: boolean
  backgroundColor?: string

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  hoverActions?: React.ReactNode
}

export default ({
  style,
  className,

  backgroundColor = "transparent",

  selected,
  task,
  multiselect,

  onSelectTask = () => {},
  onItemClick = () => {},

  hoverActions,
}: TaskProps) => {
  const theme = useTheme()

  const containerRef = React.useRef()

  const bind = useGesture({
    onTap: () => onItemClick(task.id),
  })

  return (
    <StyledListItem
      ref={containerRef}
      {...bind({ ref: containerRef })}
      style={{ ...style, backgroundColor }}
      className={className}
      selected={selected}
      button
      // onClick={() => onItemClick(task.id)}
    >
      <ListItemIcon
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          onSelectTask(task.id)
        }}
      >
        <Fab
          style={{
            borderRadius: multiselect ? "50%" : "5px",
            transition: "300ms",
            border: selected ? "1px solid blue" : "none",
            background: theme.backgroundFadedColor,
            marginLeft: 4,
          }}
          size="small"
        >
          <Assignment
            style={{
              color: theme.iconColor,
              transform: `scale(${multiselect ? 0.7 : 1})`,
              transition: "300ms",
            }}
          />
        </Fab>
      </ListItemIcon>

      <ListItemText
        primary={
          <span
            className="ellipsis bold"
            style={{
              maxWidth: "100%",
              display: "inline-block",
              fontSize: "0.95rem",
              textDecoration: task.complete ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>
        }
        secondary={
          task.notes ? (
            <span
              className="ellipsis bold"
              style={{
                maxWidth: "100%",
                display: "inline-block",
                textDecoration: task.complete ? "line-through" : "none",
              }}
            >
              {task.notes}
            </span>
          ) : (
            undefined
          )
        }
      />

      <Overlay
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
      >
        {hoverActions}
      </Overlay>
    </StyledListItem>
  )
}