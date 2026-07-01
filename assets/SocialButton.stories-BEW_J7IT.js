import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{n,t as r}from"./social-button-DfdxIX4o.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Base Components/Social Button`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Social buttons let Sagamore members sign in to the tee-sheet with the account
they already use. Under the monochromatic theme, prefer the \`gray\` variant so
provider colors don't fight the near-black palette of the member sign-in
screen — though brand and color themes are available when a provider mark is
called for.`}}},argTypes:{social:{control:`inline-radio`,options:[`google`,`facebook`,`apple`,`twitter`,`figma`,`dribble`]},theme:{control:`inline-radio`,options:[`brand`,`color`,`gray`]},size:{control:`inline-radio`,options:[`md`,`lg`]},disabled:{control:`boolean`},children:{control:`text`}},args:{social:`google`,theme:`gray`,size:`lg`,children:`Sign in with Google`}},o={},s={render:e=>(0,i.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,i.jsx)(r,{...e,social:`google`,children:`Sign in with Google`}),(0,i.jsx)(r,{...e,social:`apple`,children:`Sign in with Apple`}),(0,i.jsx)(r,{...e,social:`facebook`,children:`Sign in with Facebook`}),(0,i.jsx)(r,{...e,social:`twitter`,children:`Sign in with X`}),(0,i.jsx)(r,{...e,social:`figma`,children:`Sign in with Figma`}),(0,i.jsx)(r,{...e,social:`dribble`,children:`Sign in with Dribbble`})]}),args:{theme:`gray`,children:void 0}},c={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,i.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,i.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Brand`}),(0,i.jsxs)(`div`,{className:`flex gap-3`,children:[(0,i.jsx)(r,{...e,theme:`brand`,social:`google`,children:`Google`}),(0,i.jsx)(r,{...e,theme:`brand`,social:`apple`,children:`Apple`}),(0,i.jsx)(r,{...e,theme:`brand`,social:`facebook`,children:`Facebook`})]})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,i.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Color`}),(0,i.jsxs)(`div`,{className:`flex gap-3`,children:[(0,i.jsx)(r,{...e,theme:`color`,social:`google`,children:`Google`}),(0,i.jsx)(r,{...e,theme:`color`,social:`apple`,children:`Apple`}),(0,i.jsx)(r,{...e,theme:`color`,social:`facebook`,children:`Facebook`})]})]}),(0,i.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,i.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Gray`}),(0,i.jsxs)(`div`,{className:`flex gap-3`,children:[(0,i.jsx)(r,{...e,theme:`gray`,social:`google`,children:`Google`}),(0,i.jsx)(r,{...e,theme:`gray`,social:`apple`,children:`Apple`}),(0,i.jsx)(r,{...e,theme:`gray`,social:`facebook`,children:`Facebook`})]})]})]}),args:{children:void 0}},l={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,i.jsx)(r,{...e,size:`md`,social:`google`,children:`Sign in with Google`}),(0,i.jsx)(r,{...e,size:`md`,social:`google`})]}),(0,i.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,i.jsx)(r,{...e,size:`lg`,social:`google`,children:`Sign in with Google`}),(0,i.jsx)(r,{...e,size:`lg`,social:`google`})]})]}),args:{theme:`gray`,children:void 0}},u={args:{social:`google`,theme:`gray`,disabled:!0,children:`Sign in with Google`}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div className="grid grid-cols-2 gap-3">
            <SocialButton {...args} social="google">
                Sign in with Google
            </SocialButton>
            <SocialButton {...args} social="apple">
                Sign in with Apple
            </SocialButton>
            <SocialButton {...args} social="facebook">
                Sign in with Facebook
            </SocialButton>
            <SocialButton {...args} social="twitter">
                Sign in with X
            </SocialButton>
            <SocialButton {...args} social="figma">
                Sign in with Figma
            </SocialButton>
            <SocialButton {...args} social="dribble">
                Sign in with Dribbble
            </SocialButton>
        </div>,
  args: {
    theme: "gray",
    children: undefined
  }
}`,...s.parameters?.docs?.source},description:{story:`Every supported provider, gray theme, as they'd stack on the member sign-in screen.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Brand</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="brand" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="brand" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="brand" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Color</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="color" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="color" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="color" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Gray</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="gray" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="gray" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="gray" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
        </div>,
  args: {
    children: undefined
  }
}`,...c.parameters?.docs?.source},description:{story:`The three theme variants — brand (provider colors), color (colorful marks on gray), and gray (monochrome).`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <SocialButton {...args} size="md" social="google">
                    Sign in with Google
                </SocialButton>
                <SocialButton {...args} size="md" social="google" />
            </div>
            <div className="flex items-center gap-3">
                <SocialButton {...args} size="lg" social="google">
                    Sign in with Google
                </SocialButton>
                <SocialButton {...args} size="lg" social="google" />
            </div>
        </div>,
  args: {
    theme: "gray",
    children: undefined
  }
}`,...l.parameters?.docs?.source},description:{story:`Both sizes — md and lg — including icon-only buttons (no children).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    social: "google",
    theme: "gray",
    disabled: true,
    children: "Sign in with Google"
  }
}`,...u.parameters?.docs?.source},description:{story:`A member signing in, disabled while the request is in flight.`,...u.parameters?.docs?.description}}},d=[`Playground`,`AllProviders`,`Themes`,`Sizes`,`Disabled`]}))();export{s as AllProviders,u as Disabled,o as Playground,l as Sizes,c as Themes,d as __namedExportsOrder,a as default};