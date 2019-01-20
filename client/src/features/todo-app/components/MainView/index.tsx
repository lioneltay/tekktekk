import React, { useState } from "react"
import styled from "styled-components"
import { useAppState } from "../../state"
import { comparator, partition } from "ramda"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import ExpandMore from "@material-ui/icons/ExpandMore"
import MoreVert from "@material-ui/icons/MoreVert"

import IconButtonMenu from "../../components/IconButtonMenu"
import Task from "./Task"
import EditModal from "./EditModal"

const OldPageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const Rotate = styled.div.attrs({})<{ rotate: boolean }>`
  transform: rotate(${({ rotate }) => (rotate ? "-180deg" : "0")});
  transition: 300ms;
`

const MainView: React.FunctionComponent = () => {
  const {
    tasks,
    editing_task_id,
    show_edit_modal,
    actions: {
      stopEditingTask,
      editTask,
      uncheckCompletedTasks,
      deleteCompletedTasks,
    },
  } = useAppState()

  const [show, setShow] = useState(false)
  const toggleShow = () => setShow(show => !show)

  const editing_task = tasks.find(task => task.id === editing_task_id)

  const [complete_tasks, incomplete_tasks] = partition(
    task => task.complete,
    tasks,
  ).map(list =>
    list.sort(comparator((t1, t2) => t1.created_at > t2.created_at)),
  )

  return (
    <OldPageContainer>
      <Container>
        <List className="p-0" style={{ background: "white" }}>
          {incomplete_tasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </List>

        <List className="p-0">
          <ListItem button>
            <ListItemIcon>
              <Rotate rotate={show}>
                <IconButton onClick={toggleShow}>
                  <ExpandMore />
                </IconButton>
              </Rotate>
            </ListItemIcon>

            <ListItemText
              onClick={toggleShow}
              primary={`${complete_tasks.length} checked off`}
            />

            <ListItemSecondaryAction>
              <IconButtonMenu
                icon={<MoreVert />}
                items={[
                  {
                    label: "Uncheck all items",
                    action: uncheckCompletedTasks,
                  },
                  {
                    label: "Delete completed items",
                    action: deleteCompletedTasks,
                  },
                ]}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Collapse in={show}>
          <List className="p-0">
            {complete_tasks.map(task => (
              <Task key={task.id} task={task} />
            ))}
          </List>
        </Collapse>
      </Container>

      {editing_task ? (
        <EditModal
          initialValues={editing_task}
          open={show_edit_modal}
          onClose={stopEditingTask}
          onSubmit={async values => {
            await editTask(editing_task.id, values)
            stopEditingTask()
          }}
        />
      ) : null}
    </OldPageContainer>
  )
}

export default MainView