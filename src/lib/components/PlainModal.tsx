import React from "react"

import Modal, { ModalProps } from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"

export type PlainModalProps = Omit<ModalProps, "children" | "onClose"> & {
  children: React.ReactNode
  onClose: () => void
}

const PlainModal = ({
  className,
  style,
  children,
  ...rest
}: PlainModalProps) => {
  return (
    <Modal className="fj-c fa-c" {...rest}>
      <Paper style={style} className={className} data-testid="modal">
        {children}
      </Paper>
    </Modal>
  )
}

export default PlainModal
