import React from 'react';
import {
  Button, Modal, Input, Form,
} from 'semantic-ui-react';

import Downshift from 'downshift';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { GET_TEAM_MEMBERS_QUERY } from '../../graphql/team';


const DirectMessageModal = ({
  open, onClose, teamId, history,
}) => (
  <Query query={GET_TEAM_MEMBERS_QUERY} variables={{ teamId }}>
      {({ loading, data }) => (
        <Modal open={open} onClose={onClose}>
          <Modal.Header>Add Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                {!loading && (
                  <Downshift
                    onChange={(selectedUser) => {
                      history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                      onClose();
                    }
                    }
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
                          <Input {...getInputProps()} fluid placeholder="Search for users..." />
                          <ul {...getMenuProps()}>
                            {isOpen
                              ? data.getTeamMembers
                                .filter(item => !inputValue || item.username.includes(inputValue))
                                .map((item, index) => (
                                  <li
                                    {...getItemProps({
                                      key: item.id,
                                      index,
                                      item,
                                      style: {
                                        backgroundColor:
                                          highlightedIndex === index ? 'lightgray' : 'white',
                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                      },
                                    })}
                                  >
                                    {item.username}
                                  </li>
                                ))
                              : null}
                          </ul>
                        </div>
                    )}
                  </Downshift>
                )}
              </Form.Field>
              <Form.Group widths="equal" className="center">
                <Button onClick={onClose} type="button">Cancel</Button>
              </Form.Group>
            </Form>
          </Modal.Content>
        </Modal>
      )}
    </Query>
);

export default withRouter(DirectMessageModal);
