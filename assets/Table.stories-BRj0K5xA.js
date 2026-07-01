import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-JEutOpZn.js";import{Gt as i,Pr as a,Vn as o,hn as s,kn as c,n as l,w as u}from"./dist-Ce7pAI2g.js";import{A as ee,D as d,E as te,Lt as ne,O as re,On as f,T as p,j as m,k as h,t as g}from"./exports-C3MqGbMz.js";import{n as ie,t as _}from"./cx-BIL-0sez.js";import{n as v,r as y,t as b}from"./tooltip-CTw5z4yE.js";import{i as x,n as S,t as ae}from"./badges-DTnZ6G-Y.js";import{r as C,t as w}from"./checkbox-C88IS67N.js";import{n as T,t as E}from"./avatar-B8VsAF9v.js";import{n as D,t as O}from"./dropdown-C6ft7F3t.js";var k,A,j,M,N,P,F,I,L,R,z,B,V,H=e((()=>{k=n(),A=t(r()),l(),g(),x(),C(),D(),y(),ie(),j=()=>(0,k.jsxs)(O.Root,{children:[(0,k.jsx)(O.DotsButton,{}),(0,k.jsx)(O.Popover,{className:`w-min`,children:(0,k.jsxs)(O.Menu,{children:[(0,k.jsx)(O.Item,{icon:s,children:(0,k.jsx)(`span`,{className:`pr-4`,children:`Edit`})}),(0,k.jsx)(O.Item,{icon:c,children:(0,k.jsx)(`span`,{className:`pr-4`,children:`Copy link`})}),(0,k.jsx)(O.Item,{icon:u,children:(0,k.jsx)(`span`,{className:`pr-4`,children:`Delete`})})]})})]}),M=(0,A.createContext)({size:`md`}),N=({children:e,className:t,size:n=`md`,...r})=>(0,k.jsx)(M.Provider,{value:{size:n},children:(0,k.jsx)(`div`,{...r,className:_(`overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary`,t),children:e})}),P=({title:e,badge:t,description:n,contentTrailing:r,className:i})=>{let{size:a}=(0,A.useContext)(M);return(0,k.jsxs)(`div`,{className:_(`relative flex flex-col items-start gap-4 border-b border-secondary bg-primary px-4 md:flex-row`,a===`sm`?`py-4 md:px-5`:`py-5 md:px-6`,i),children:[(0,k.jsxs)(`div`,{className:`flex flex-1 flex-col gap-0.5`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(`h2`,{className:`text-md font-semibold text-primary`,children:e}),t?(0,A.isValidElement)(t)?t:(0,k.jsx)(ae,{color:`gray`,size:`sm`,type:`modern`,children:t}):null]}),n&&(0,k.jsx)(`p`,{className:`text-sm text-tertiary`,children:n})]}),r]})},F=({className:e,size:t=`md`,...n})=>{let r=(0,A.useContext)(M);return(0,k.jsx)(M.Provider,{value:{size:r?.size??t},children:(0,k.jsx)(`div`,{className:`overflow-x-auto`,children:(0,k.jsx)(p,{className:t=>_(`w-full overflow-x-hidden`,typeof e==`function`?e(t):e),...n})})})},F.displayName=`Table`,I=({columns:e,children:t,bordered:n=!0,className:r,size:i,...a})=>{let o=(0,A.useContext)(M),{selectionBehavior:s,selectionMode:c}=m(),l=i??o.size;return(0,k.jsxs)(ee,{...a,className:e=>_(`relative bg-secondary`,l===`sm`?`h-9`:`h-11`,n&&`[&>tr>th]:after:pointer-events-none [&>tr>th]:after:absolute [&>tr>th]:after:inset-x-0 [&>tr>th]:after:bottom-0 [&>tr>th]:after:h-px [&>tr>th]:after:bg-border-secondary [&>tr>th]:focus-visible:after:bg-transparent`,typeof r==`function`?r(e):r),children:[s===`toggle`&&(0,k.jsx)(d,{className:_(`relative py-2 pr-0 pl-4`,l===`sm`?`w-9 md:pl-5`:`w-11 md:pl-6`),children:c===`multiple`&&(0,k.jsx)(`div`,{className:`flex items-start`,children:(0,k.jsx)(w,{slot:`selection`,size:`md`})})}),(0,k.jsx)(f,{items:e,children:t})]})},I.displayName=`TableHeader`,L=({className:e,tooltip:t,label:n,children:r,...s})=>{let{selectionBehavior:c}=m();return(0,k.jsx)(d,{...s,className:t=>_(`relative p-0 px-6 py-2 outline-hidden focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-bg-primary focus-visible:ring-inset`,c===`toggle`&&`nth-2:pl-3`,t.allowsSorting&&`cursor-pointer`,typeof e==`function`?e(t):e),children:e=>(0,k.jsxs)(ne,{className:`flex items-center gap-1`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-1`,children:[n&&(0,k.jsx)(`span`,{className:`text-xs font-semibold whitespace-nowrap text-quaternary`,children:n}),typeof r==`function`?r(e):r]}),t&&(0,k.jsx)(b,{title:t,placement:`top`,children:(0,k.jsx)(v,{className:`cursor-pointer text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover`,children:(0,k.jsx)(i,{className:`size-4`})})}),e.allowsSorting&&(e.sortDirection?(0,k.jsx)(a,{className:_(`size-3 stroke-[3px] text-fg-quaternary`,e.sortDirection===`ascending`&&`rotate-180`)}):(0,k.jsx)(o,{size:12,strokeWidth:3,className:`text-fg-quaternary`}))]})})},L.displayName=`TableHead`,R=({columns:e,children:t,className:n,highlightSelectedRow:r=!0,size:i,...a})=>{let o=(0,A.useContext)(M),{selectionBehavior:s}=m(),c=i??o.size;return(0,k.jsxs)(re,{...a,className:e=>_(`relative outline-focus-ring transition-colors after:pointer-events-none hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2`,c===`sm`?`h-14`:`h-18`,r&&`selected:bg-secondary`,`[&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden [&>td]:focus-visible:after:opacity-0 focus-visible:[&>td]:after:opacity-0`,typeof n==`function`?n(e):n),children:[s===`toggle`&&(0,k.jsx)(h,{className:_(`relative py-2 pr-0 pl-4`,c===`sm`?`md:pl-5`:`md:pl-6`),children:(0,k.jsx)(`div`,{className:`flex items-end`,children:(0,k.jsx)(w,{slot:`selection`,size:`md`})})}),(0,k.jsx)(f,{items:e,children:t})]})},R.displayName=`TableRow`,z=({className:e,children:t,size:n,...r})=>{let i=(0,A.useContext)(M),{selectionBehavior:a}=m(),o=n??i.size;return(0,k.jsx)(h,{...r,className:t=>_(`relative text-sm text-tertiary outline-focus-ring focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2`,o===`sm`&&`px-5 py-3`,o===`md`&&`px-6 py-4`,a===`toggle`&&`nth-2:pl-3`,typeof e==`function`?e(t):e),children:t})},z.displayName=`TableCell`,B={Root:N,Header:P},V=F,V.Body=te,V.Cell=z,V.Head=L,V.Header=I,V.Row=R,j.__docgenInfo={description:``,methods:[],displayName:`TableRowActionsDropdown`},F.__docgenInfo={description:``,methods:[],displayName:`Table`,props:{size:{required:!1,tsType:{name:`union`,raw:`"sm" | "md"`,elements:[{name:`literal`,value:`"sm"`},{name:`literal`,value:`"md"`}]},description:``,defaultValue:{value:`"md"`,computed:!1}}},composes:[`AriaTableProps`,`Omit`]}})),U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{U=n(),W=t(r()),H(),T(),x(),G={title:`Application Components/Table`,component:V,parameters:{layout:`padded`,docs:{description:{component:`The morning tee sheet, rendered. Each row is a booked block on the first tee at
Sagamore — time, the member up next, holes they've signed up for, and where
their round stands. Built on react-aria-components, so keyboard nav, selection,
and column sorting all come for free. Keep it monochromatic; let the starter's
board do the talking.`}}},argTypes:{size:{control:`radio`,options:[`sm`,`md`],description:`Row density for the tee sheet.`},selectionMode:{control:`radio`,options:[`none`,`single`,`multiple`],description:`Whether starters can check off rows.`}}},K={"On the tee":`brand`,"Out on the course":`success`,"Holed out":`gray`,"No-show":`warning`},q=[{id:`1`,time:`7:10 AM`,player:`Bobby Jones`,avatar:`https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80`,holes:`18`,status:`Out on the course`},{id:`2`,time:`7:20 AM`,player:`Patty Berg`,holes:`18`,status:`On the tee`},{id:`3`,time:`7:30 AM`,player:`Walter Hagen`,avatar:`https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80`,holes:`9`,status:`Holed out`},{id:`4`,time:`7:40 AM`,player:`Mickey Wright`,holes:`18`,status:`No-show`},{id:`5`,time:`7:50 AM`,player:`Gene Sarazen`,avatar:`https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80`,holes:`9`,status:`On the tee`}],J=({row:e})=>(0,U.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,U.jsx)(E,{size:`sm`,src:e.avatar,alt:e.player,initials:e.player.charAt(0)}),(0,U.jsx)(`span`,{className:`text-sm font-medium text-primary`,children:e.player})]}),Y={args:{size:`md`,"aria-label":`Morning tee sheet`},render:e=>(0,U.jsxs)(V,{...e,children:[(0,U.jsxs)(V.Header,{children:[(0,U.jsx)(V.Head,{label:`Time`,isRowHeader:!0,className:`w-28`}),(0,U.jsx)(V.Head,{label:`Player`}),(0,U.jsx)(V.Head,{label:`Holes`,className:`w-24`}),(0,U.jsx)(V.Head,{label:`Status`,className:`w-44`}),(0,U.jsx)(V.Head,{label:``,className:`w-16`})]}),(0,U.jsx)(V.Body,{items:q,children:e=>(0,U.jsxs)(V.Row,{id:e.id,children:[(0,U.jsx)(V.Cell,{className:`font-medium text-primary`,children:e.time}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(J,{row:e})}),(0,U.jsx)(V.Cell,{children:e.holes}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(S,{size:`sm`,type:`pill-color`,color:K[e.status],children:e.status})}),(0,U.jsx)(V.Cell,{className:`text-right`})]})})]})},X={args:{"aria-label":`Sortable tee sheet`},render:e=>(0,U.jsx)(()=>{let[t,n]=(0,W.useState)({column:`time`,direction:`ascending`}),r=[...q].sort((e,n)=>{let r=e.time.localeCompare(n.time);return t.direction===`descending`?-r:r});return(0,U.jsxs)(V,{...e,sortDescriptor:t,onSortChange:n,children:[(0,U.jsxs)(V.Header,{children:[(0,U.jsx)(V.Head,{id:`time`,label:`Time`,isRowHeader:!0,allowsSorting:!0,className:`w-28`}),(0,U.jsx)(V.Head,{id:`player`,label:`Player`}),(0,U.jsx)(V.Head,{id:`holes`,label:`Holes`,className:`w-24`}),(0,U.jsx)(V.Head,{id:`status`,label:`Status`,className:`w-44`})]}),(0,U.jsx)(V.Body,{items:r,children:e=>(0,U.jsxs)(V.Row,{id:e.id,children:[(0,U.jsx)(V.Cell,{className:`font-medium text-primary`,children:e.time}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(J,{row:e})}),(0,U.jsx)(V.Cell,{children:e.holes}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(S,{size:`sm`,type:`pill-color`,color:K[e.status],children:e.status})})]})})]})},{})},Z={args:{"aria-label":`Tee sheet with row actions`},render:e=>(0,U.jsxs)(V,{...e,children:[(0,U.jsxs)(V.Header,{children:[(0,U.jsx)(V.Head,{label:`Time`,isRowHeader:!0,className:`w-28`}),(0,U.jsx)(V.Head,{label:`Player`}),(0,U.jsx)(V.Head,{label:`Holes`,className:`w-24`}),(0,U.jsx)(V.Head,{label:`Status`,className:`w-44`}),(0,U.jsx)(V.Head,{label:``,className:`w-16`})]}),(0,U.jsx)(V.Body,{items:q,children:e=>(0,U.jsxs)(V.Row,{id:e.id,children:[(0,U.jsx)(V.Cell,{className:`font-medium text-primary`,children:e.time}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(J,{row:e})}),(0,U.jsx)(V.Cell,{children:e.holes}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(S,{size:`sm`,type:`pill-color`,color:K[e.status],children:e.status})}),(0,U.jsx)(V.Cell,{className:`px-4`,children:(0,U.jsx)(`div`,{className:`flex justify-end`,children:(0,U.jsx)(j,{})})})]})})]})},Q={args:{"aria-label":`Tee sheet card`,selectionMode:`multiple`},render:e=>(0,U.jsx)(()=>{let[t,n]=(0,W.useState)(new Set([`2`]));return(0,U.jsxs)(B.Root,{children:[(0,U.jsx)(B.Header,{title:`Morning tee sheet`,badge:`5 bookings`,description:`First tee, front nine. Saturday, June 18.`}),(0,U.jsxs)(V,{...e,selectedKeys:t,onSelectionChange:n,children:[(0,U.jsxs)(V.Header,{children:[(0,U.jsx)(V.Head,{label:`Time`,isRowHeader:!0,className:`w-28`}),(0,U.jsx)(V.Head,{label:`Player`}),(0,U.jsx)(V.Head,{label:`Holes`,className:`w-24`}),(0,U.jsx)(V.Head,{label:`Status`,className:`w-44`}),(0,U.jsx)(V.Head,{label:``,className:`w-16`})]}),(0,U.jsx)(V.Body,{items:q,children:e=>(0,U.jsxs)(V.Row,{id:e.id,children:[(0,U.jsx)(V.Cell,{className:`font-medium text-primary`,children:e.time}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(J,{row:e})}),(0,U.jsx)(V.Cell,{children:e.holes}),(0,U.jsx)(V.Cell,{children:(0,U.jsx)(S,{size:`sm`,type:`pill-color`,color:K[e.status],children:e.status})}),(0,U.jsx)(V.Cell,{className:`px-4`,children:(0,U.jsx)(`div`,{className:`flex justify-end`,children:(0,U.jsx)(j,{})})})]})})]})]})},{})},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    size: "md",
    "aria-label": "Morning tee sheet"
  },
  render: args => <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {row => <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="text-right" />
                    </Table.Row>}
            </Table.Body>
        </Table>
}`,...Y.parameters?.docs?.source},description:{story:`The full tee sheet — time, member, holes, status, and a quiet actions column.`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-label": "Sortable tee sheet"
  },
  render: args => {
    const SortableTable = () => {
      const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "time",
        direction: "ascending"
      });
      const sorted = [...teeTimes].sort((a, b) => {
        const cmp = a.time.localeCompare(b.time);
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
      return <Table {...args} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                    <Table.Header>
                        <Table.Head id="time" label="Time" isRowHeader allowsSorting className="w-28" />
                        <Table.Head id="player" label="Player" />
                        <Table.Head id="holes" label="Holes" className="w-24" />
                        <Table.Head id="status" label="Status" className="w-44" />
                    </Table.Header>
                    <Table.Body items={sorted}>
                        {row => <Table.Row id={row.id}>
                                <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                <Table.Cell>
                                    <PlayerCell row={row} />
                                </Table.Cell>
                                <Table.Cell>{row.holes}</Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                        {row.status}
                                    </BadgeWithDot>
                                </Table.Cell>
                            </Table.Row>}
                    </Table.Body>
                </Table>;
    };
    return <SortableTable />;
  }
}`,...X.parameters?.docs?.source},description:{story:`Same sheet, but the starter can sort by tee time — click the Time column header.`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-label": "Tee sheet with row actions"
  },
  render: args => <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {row => <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="px-4">
                            <div className="flex justify-end">
                                <TableRowActionsDropdown />
                            </div>
                        </Table.Cell>
                    </Table.Row>}
            </Table.Body>
        </Table>
}`,...Z.parameters?.docs?.source},description:{story:`Every row ends in a dots menu — edit the booking, copy the link, or scratch it.`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-label": "Tee sheet card",
    selectionMode: "multiple"
  },
  render: args => {
    const CardTable = () => {
      const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));
      return <TableCard.Root>
                    <TableCard.Header title="Morning tee sheet" badge="5 bookings" description="First tee, front nine. Saturday, June 18." />
                    <Table {...args} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-28" />
                            <Table.Head label="Player" />
                            <Table.Head label="Holes" className="w-24" />
                            <Table.Head label="Status" className="w-44" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={teeTimes}>
                            {row => <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                    <Table.Cell>
                                        <PlayerCell row={row} />
                                    </Table.Cell>
                                    <Table.Cell>{row.holes}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                            {row.status}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell className="px-4">
                                        <div className="flex justify-end">
                                            <TableRowActionsDropdown />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>}
                        </Table.Body>
                    </Table>
                </TableCard.Root>;
    };
    return <CardTable />;
  }
}`,...Q.parameters?.docs?.source},description:{story:`The tee sheet tucked into a titled card, with selectable rows for the starter.`,...Q.parameters?.docs?.description}}},$=[`Playground`,`Sortable`,`WithRowActions`,`WithCardWrapper`]}))();export{Y as Playground,X as Sortable,Q as WithCardWrapper,Z as WithRowActions,$ as __namedExportsOrder,G as default};