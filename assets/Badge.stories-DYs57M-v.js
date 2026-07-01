import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{i as n,t as r}from"./badges-DTnZ6G-Y.js";var i,a,o,s,c,l,u;e((()=>{i=t(),n(),a={title:`Base Components/Badge`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Badges carry the metadata on every tee time — rate type, holes, spots
remaining, course status. Monochromatic: we use the neutral \`gray\` colour so
the whole tee sheet stays calm and minimal.`}}},argTypes:{type:{control:`inline-radio`,options:[`pill-color`,`color`,`modern`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},children:{control:`text`}},args:{type:`pill-color`,size:`md`,color:`gray`,children:`Members only`}},o={},s={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,i.jsx)(r,{type:`pill-color`,size:`md`,color:`gray`,children:`Twilight rate`}),(0,i.jsx)(r,{type:`color`,size:`md`,color:`gray`,children:`9 holes`}),(0,i.jsx)(r,{type:`modern`,size:`md`,children:`Cart included`})]})},c={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,i.jsx)(r,{...e,size:`sm`,children:`Small`}),(0,i.jsx)(r,{...e,size:`md`,children:`Medium`}),(0,i.jsx)(r,{...e,size:`lg`,children:`Large`})]})},l={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,i.jsx)(r,{type:`pill-color`,size:`md`,color:`gray`,children:`Members only`}),(0,i.jsx)(r,{type:`modern`,size:`md`,children:`18 holes`}),(0,i.jsx)(r,{type:`modern`,size:`md`,children:`1 spot left`}),(0,i.jsx)(r,{type:`modern`,size:`md`,children:`Cart incl.`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-2">
            <Badge type="pill-color" size="md" color="gray">
                Twilight rate
            </Badge>
            <Badge type="color" size="md" color="gray">
                9 holes
            </Badge>
            <Badge type="modern" size="md">
                Cart included
            </Badge>
        </div>
}`,...s.parameters?.docs?.source},description:{story:"The three badge shapes. Note `modern` styles itself and takes no colour.",...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-2">
            <Badge {...args} size="sm">
                Small
            </Badge>
            <Badge {...args} size="md">
                Medium
            </Badge>
            <Badge {...args} size="lg">
                Large
            </Badge>
        </div>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-2">
            <Badge type="pill-color" size="md" color="gray">
                Members only
            </Badge>
            <Badge type="modern" size="md">
                18 holes
            </Badge>
            <Badge type="modern" size="md">
                1 spot left
            </Badge>
            <Badge type="modern" size="md">
                Cart incl.
            </Badge>
        </div>
}`,...l.parameters?.docs?.source},description:{story:`The real set of tags shown on a Sagamore tee-time row.`,...l.parameters?.docs?.description}}},u=[`Playground`,`Types`,`Sizes`,`TeeTimeTags`]}))();export{o as Playground,c as Sizes,l as TeeTimeTags,s as Types,u as __namedExportsOrder,a as default};