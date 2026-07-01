import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-JEutOpZn.js";import{i,n as a,r as o,t as s}from"./tags-CUa8-Lcn.js";var c,l,u,d,f,p,m,h,g;e((()=>{c=n(),l=t(r()),i(),u={title:`Base Components/Tags`,component:s,parameters:{layout:`centered`,docs:{description:{component:`Tags label and filter tee-time attributes at Sagamore — rate type, holes,
playing partners. They support dots, counts, avatars, removal, and single or
multiple selection. Monochromatic and calm by default.`}}}},d={render:()=>(0,c.jsx)(a,{label:`Tee-time attributes`,children:(0,c.jsxs)(o,{className:`flex flex-wrap gap-2`,children:[(0,c.jsx)(s,{id:`members`,dot:!0,children:`Members only`}),(0,c.jsx)(s,{id:`holes`,count:18,children:`Holes`}),(0,c.jsx)(s,{id:`cart`,children:`Cart included`})]})})},f={render:()=>(0,c.jsx)(a,{label:`Playing group`,children:(0,c.jsxs)(o,{className:`flex flex-wrap gap-2`,children:[(0,c.jsx)(s,{id:`olivia`,avatarSrc:`https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80`,children:`Olivia`}),(0,c.jsx)(s,{id:`phoenix`,avatarSrc:`https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80`,children:`Phoenix`}),(0,c.jsx)(s,{id:`lana`,avatarSrc:`https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80`,children:`Lana`})]})})},p={render:()=>{let[e,t]=(0,l.useState)([{id:`twilight`,label:`Twilight`},{id:`walking`,label:`Walking`},{id:`9holes`,label:`9 holes`}]);return(0,c.jsx)(a,{label:`Active filters`,children:(0,c.jsx)(o,{className:`flex flex-wrap gap-2`,children:e.map(e=>(0,c.jsx)(s,{id:e.id,onClose:e=>t(t=>t.filter(t=>t.id!==e)),children:e.label},e.id))})})}},m={render:()=>(0,c.jsx)(a,{label:`Filter by rate`,selectionMode:`multiple`,defaultSelectedKeys:[`twilight`],children:(0,c.jsxs)(o,{className:`flex flex-wrap gap-2`,children:[(0,c.jsx)(s,{id:`standard`,children:`Standard`}),(0,c.jsx)(s,{id:`twilight`,children:`Twilight`}),(0,c.jsx)(s,{id:`member`,children:`Member`}),(0,c.jsx)(s,{id:`replay`,children:`Replay`})]})})},h={render:()=>(0,c.jsx)(`div`,{className:`flex flex-col items-start gap-4`,children:[`sm`,`md`,`lg`].map(e=>(0,c.jsx)(a,{label:`Size ${e}`,size:e,children:(0,c.jsxs)(o,{className:`flex flex-wrap gap-2`,children:[(0,c.jsx)(s,{id:`members`,dot:!0,children:`Members only`}),(0,c.jsx)(s,{id:`holes`,count:18,children:`Holes`}),(0,c.jsx)(s,{id:`cart`,children:`Cart included`})]})},e))})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <TagGroup label="Tee-time attributes">
            <TagList className="flex flex-wrap gap-2">
                <Tag id="members" dot>
                    Members only
                </Tag>
                <Tag id="holes" count={18}>
                    Holes
                </Tag>
                <Tag id="cart">Cart included</Tag>
            </TagList>
        </TagGroup>
}`,...d.parameters?.docs?.source},description:{story:`A basic, non-selectable set of tee-time attributes.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <TagGroup label="Playing group">
            <TagList className="flex flex-wrap gap-2">
                <Tag id="olivia" avatarSrc="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80">
                    Olivia
                </Tag>
                <Tag id="phoenix" avatarSrc="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80">
                    Phoenix
                </Tag>
                <Tag id="lana" avatarSrc="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80">
                    Lana
                </Tag>
            </TagList>
        </TagGroup>
}`,...f.parameters?.docs?.source},description:{story:`Avatars on tags identify the playing group.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = useState([{
      id: "twilight",
      label: "Twilight"
    }, {
      id: "walking",
      label: "Walking"
    }, {
      id: "9holes",
      label: "9 holes"
    }]);
    return <TagGroup label="Active filters">
                <TagList className="flex flex-wrap gap-2">
                    {tags.map(t => <Tag key={t.id} id={t.id} onClose={id => setTags(prev => prev.filter(x => x.id !== id))}>
                            {t.label}
                        </Tag>)}
                </TagList>
            </TagGroup>;
  }
}`,...p.parameters?.docs?.source},description:{story:"Removable filter chips — the X calls `onClose` with the tag id.",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <TagGroup label="Filter by rate" selectionMode="multiple" defaultSelectedKeys={["twilight"]}>
            <TagList className="flex flex-wrap gap-2">
                <Tag id="standard">Standard</Tag>
                <Tag id="twilight">Twilight</Tag>
                <Tag id="member">Member</Tag>
                <Tag id="replay">Replay</Tag>
            </TagList>
        </TagGroup>
}`,...m.parameters?.docs?.source},description:{story:`Multiple-selection mode renders a checkbox inside each tag.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map(size => <TagGroup key={size} label={\`Size \${size}\`} size={size}>
                    <TagList className="flex flex-wrap gap-2">
                        <Tag id="members" dot>
                            Members only
                        </Tag>
                        <Tag id="holes" count={18}>
                            Holes
                        </Tag>
                        <Tag id="cart">Cart included</Tag>
                    </TagList>
                </TagGroup>)}
        </div>
}`,...h.parameters?.docs?.source},description:{story:`All three sizes.`,...h.parameters?.docs?.description}}},g=[`Playground`,`WithAvatars`,`Removable`,`Selectable`,`Sizes`]}))();export{d as Playground,p as Removable,m as Selectable,h as Sizes,f as WithAvatars,g as __namedExportsOrder,u as default};