import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { SketchPicker } from 'react-color';
import { Button } from '@codesandbox/common/lib/components/Button';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import { Checkbox } from '@codesandbox/common/lib/components/Checkbox';
import * as templates from '@codesandbox/common/lib/templates';
import uniq from 'lodash-es/uniq';
import { useStore, useSignals } from 'app/store';

import { Heading, Container, Explanation } from '../elements';
import {
  Fieldset,
  Label,
  DefaultColor,
  GlobalStylesTemplateModal,
} from './elements';

const TemplateModal = () => {
  const { editor, workspace } = useStore();
  const { workspace: workspaceSignals } = useSignals();

  const templateColors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));
  const sandbox = editor.currentSandbox;
  const template = templates.default(sandbox.template);

  const { title, description } = sandbox.customTemplate || workspace.project;
  const [selected, setSelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    (sandbox.customTemplate && sandbox.customTemplate.color) || template.color()
  );
  const [templateTitle, setStaterTitle] = useState(title);
  const [templateDescription, setStaterDescription] = useState(description);

  const newTemplate = {
    template: {
      color: selectedColor,
      title: templateTitle,
      description: templateDescription,
      icon_url: sandbox.template,
      published: selected,
    },
  };

  const makeTemplate = e => {
    e.preventDefault();
    workspaceSignals.addedTemplate({
      ...newTemplate,
    });
  };

  const editTemplate = e => {
    e.preventDefault();
    workspaceSignals.editTemplate({
      ...newTemplate,
    });
  };

  return (
    <Container>
      <GlobalStylesTemplateModal />
      <Heading>Make Template</Heading>
      <Explanation>
        By making your sandbox a template you will be able to see it in your
        create sandbox modal and start with this sandbox quickly.
        <br />
        If you decide to make it public it can be used by anyone in the
        CodeSandbox community.
      </Explanation>
      <Fieldset>
        <Label htmlFor="title">Title</Label>
        <Input
          block
          name="title"
          required
          id="title"
          value={templateTitle}
          onChange={e => setStaterTitle(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="description">Description</Label>
        <TextArea
          block
          required
          name="description"
          id="description"
          value={templateDescription}
          onChange={e => setStaterDescription(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="public">Make Public?</Label>
        <Checkbox
          checked={selected}
          id="public"
          onChange={() => setSelected(!selected)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="color">Template Color?</Label>
        <DefaultColor
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          id="color"
          color={selectedColor}
        />
        {showPicker ? (
          <OutsideClickHandler
            onOutsideClick={() => {
              setShowPicker(false);
            }}
          >
            <SketchPicker
              id="color"
              onChangeComplete={color => setSelectedColor(color.hex)}
              color={selectedColor}
              presetColors={uniq(templateColors)}
            />
          </OutsideClickHandler>
        ) : null}
      </Fieldset>
      {sandbox.customTemplate ? (
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
          `}
        >
          <Button small onClick={editTemplate} type="button">
            Edit template
          </Button>
          <Button
            red
            small
            onClick={() => workspaceSignals.deleteTemplate()}
            type="button"
          >
            Delete template
          </Button>
        </div>
      ) : (
        <Button
          onClick={makeTemplate}
          css={`
            margin-top: 1rem;
          `}
          small
        >
          Make Template
        </Button>
      )}
    </Container>
  );
};

export default TemplateModal;