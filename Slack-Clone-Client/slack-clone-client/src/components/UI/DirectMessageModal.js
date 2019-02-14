import React from 'react';
import {
  Button, Modal, Input, Form,
} from 'semantic-ui-react';

import Downshift from 'downshift';


const DirectMessageModal = ({
  open,
  onClose,
}) => (
  <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Downshift
              onChange={selected => console.log(selected)}
              itemToString={item => (item ? item.value : '')}
            >
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
              }) => (
                <div>
                    <label {...getLabelProps()} />
                    <Input {...getInputProps()} fluid placeholder="hello" />
                    <ul {...getMenuProps()}>
                      {isOpen
                        ? ['apple', 'orange', 'carrot']
                          .filter(item => !inputValue || item.includes(inputValue))
                          .map((item, index) => (
                            <li
                              {...getItemProps({
                                key: item,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index ? 'lightgray' : 'white',
                                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                                },
                              })}
                            >
                              {item}
                            </li>
                          ))
                        : null}
                    </ul>
                  </div>
              )}
            </Downshift>
          </Form.Field>
          <Form.Group widths="equal" className="center">
            <Button onClick={onClose} type="button">Cancel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
);

export default DirectMessageModal;
