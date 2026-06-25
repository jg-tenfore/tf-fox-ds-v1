import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{Jn as n,Un as r,n as i}from"./dist-DtvLQRd8.js";import{n as a,t as o}from"./cx-BIL-0sez.js";import{r as s,t as c}from"./sagamore-assets-6JmsGryk.js";import{n as l,t as u}from"./carousel-base-Bh98mTEh.js";var d,f,p,m,h,g,_,v,y,b,x;e((()=>{d=t(),i(),l(),c(),a(),f={title:`Application Components/Carousel`,component:u.Root,parameters:{layout:`centered`,docs:{description:{component:`The Carousel walks a golfer through the course one frame at a time — a gallery
of signature holes, a flyover of the back nine, or the morning view from the
first tee. Built on Embla, it keeps the swing smooth on touch and keyboard
alike. Every frame uses real Sagamore photography indexed from images/sagamore.`}}},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`],description:`Direction the frames scroll past.`}}},p=s(`photography`),m=`absolute top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover`,h=({src:e,alt:t})=>(0,d.jsx)(`img`,{src:e,alt:t,className:`aspect-video w-full rounded-xl object-cover`,loading:`lazy`}),g={render:e=>(0,d.jsxs)(u.Root,{...e,className:`w-150`,children:[(0,d.jsx)(u.Content,{className:`gap-4`,children:p.map(e=>(0,d.jsx)(u.Item,{children:(0,d.jsx)(h,{src:e.src,alt:e.name})},e.name))}),(0,d.jsx)(u.PrevTrigger,{className:({isDisabled:e})=>o(m,`left-3`,e&&`cursor-not-allowed opacity-50`),children:(0,d.jsx)(n,{className:`size-5`,"aria-hidden":`true`})}),(0,d.jsx)(u.NextTrigger,{className:({isDisabled:e})=>o(m,`right-3`,e&&`cursor-not-allowed opacity-50`),children:(0,d.jsx)(r,{className:`size-5`,"aria-hidden":`true`})}),(0,d.jsx)(u.IndicatorGroup,{className:`absolute inset-x-0 bottom-3 flex justify-center gap-2`,children:({index:e})=>(0,d.jsx)(u.Indicator,{index:e,className:({isSelected:e})=>o(`size-2 rounded-full transition duration-100 ease-linear`,e?`w-5 bg-white`:`bg-white/60`)},e)})]})},_={render:()=>(0,d.jsxs)(u.Root,{opts:{loop:!0},className:`w-150`,children:[(0,d.jsx)(u.Content,{className:`gap-4`,children:p.map(e=>(0,d.jsx)(u.Item,{children:(0,d.jsx)(h,{src:e.src,alt:e.name})},e.name))}),(0,d.jsx)(u.PrevTrigger,{className:o(m,`left-3`),children:(0,d.jsx)(n,{className:`size-5`,"aria-hidden":`true`})}),(0,d.jsx)(u.NextTrigger,{className:o(m,`right-3`),children:(0,d.jsx)(r,{className:`size-5`,"aria-hidden":`true`})})]})},v={render:()=>(0,d.jsxs)(u.Root,{className:`w-150`,children:[(0,d.jsx)(u.Content,{className:`gap-4`,children:p.map(e=>(0,d.jsx)(u.Item,{children:(0,d.jsx)(h,{src:e.src,alt:e.name})},e.name))}),(0,d.jsx)(u.IndicatorGroup,{className:`mt-4 flex justify-center gap-2`,children:({index:e})=>(0,d.jsx)(u.Indicator,{index:e,className:({isSelected:e})=>o(`size-2.5 rounded-full transition duration-100 ease-linear`,e?`bg-fg-primary`:`bg-fg-quaternary`)},e)})]})},y={render:()=>(0,d.jsxs)(u.Root,{opts:{loop:!0},className:`w-150`,children:[(0,d.jsx)(u.Content,{children:p.map(e=>(0,d.jsx)(u.Item,{children:(0,d.jsx)(h,{src:e.src,alt:e.name})},e.name))}),(0,d.jsx)(u.PrevTrigger,{className:o(m,`left-3`),children:(0,d.jsx)(n,{className:`size-5`,"aria-hidden":`true`})}),(0,d.jsx)(u.NextTrigger,{className:o(m,`right-3`),children:(0,d.jsx)(r,{className:`size-5`,"aria-hidden":`true`})})]})},b={render:()=>(0,d.jsxs)(u.Root,{orientation:`vertical`,className:`h-100 w-150`,children:[(0,d.jsx)(u.Content,{className:`h-100 gap-4`,children:p.map(e=>(0,d.jsx)(u.Item,{className:`basis-full`,children:(0,d.jsx)(`img`,{src:e.src,alt:e.name,className:`size-full rounded-xl object-cover`,loading:`lazy`})},e.name))}),(0,d.jsx)(u.PrevTrigger,{className:`absolute top-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover`,children:(0,d.jsx)(n,{className:`size-5 rotate-90`,"aria-hidden":`true`})}),(0,d.jsx)(u.NextTrigger,{className:`absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover`,children:(0,d.jsx)(r,{className:`size-5 rotate-90`,"aria-hidden":`true`})})]})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Carousel.Root {...args} className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map(photo => <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>)}
            </Carousel.Content>

            <Carousel.PrevTrigger className={({
      isDisabled
    }) => cx(arrowClass, "left-3", isDisabled && "cursor-not-allowed opacity-50")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={({
      isDisabled
    }) => cx(arrowClass, "right-3", isDisabled && "cursor-not-allowed opacity-50")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>

            <Carousel.IndicatorGroup className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {({
        index
      }) => <Carousel.Indicator key={index} index={index} className={({
        isSelected
      }) => cx("size-2 rounded-full transition duration-100 ease-linear", isSelected ? "w-5 bg-white" : "bg-white/60")} />}
            </Carousel.IndicatorGroup>
        </Carousel.Root>
}`,...g.parameters?.docs?.source},description:{story:`Default flyover of the course with arrow triggers and dot indicators.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel.Root opts={{
    loop: true
  }} className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map(photo => <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>)}
            </Carousel.Content>

            <Carousel.PrevTrigger className={cx(arrowClass, "left-3")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={cx(arrowClass, "right-3")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
}`,..._.parameters?.docs?.source},description:{story:`Looping gallery: arrows never disable because the reel wraps back to the first frame.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel.Root className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map(photo => <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>)}
            </Carousel.Content>

            <Carousel.IndicatorGroup className="mt-4 flex justify-center gap-2">
                {({
        index
      }) => <Carousel.Indicator key={index} index={index} className={({
        isSelected
      }) => cx("size-2.5 rounded-full transition duration-100 ease-linear", isSelected ? "bg-fg-primary" : "bg-fg-quaternary")} />}
            </Carousel.IndicatorGroup>
        </Carousel.Root>
}`,...v.parameters?.docs?.source},description:{story:`Dot indicators only — a clean photo strip with no arrows; swipe or tap a dot to navigate.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel.Root opts={{
    loop: true
  }} className="w-150">
            <Carousel.Content>
                {PHOTOS.map(photo => <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>)}
            </Carousel.Content>

            <Carousel.PrevTrigger className={cx(arrowClass, "left-3")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={cx(arrowClass, "right-3")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
}`,...y.parameters?.docs?.source},description:{story:`Looping course photography framed with overlay arrow triggers.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel.Root orientation="vertical" className="h-100 w-150">
            <Carousel.Content className="h-100 gap-4">
                {PHOTOS.map(photo => <Carousel.Item key={photo.name} className="basis-full">
                        <img src={photo.src} alt={photo.name} className="size-full rounded-xl object-cover" loading="lazy" />
                    </Carousel.Item>)}
            </Carousel.Content>

            <Carousel.PrevTrigger className="absolute top-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover">
                <ChevronLeft className="size-5 rotate-90" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className="absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover">
                <ChevronRight className="size-5 rotate-90" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
}`,...b.parameters?.docs?.source},description:{story:`Vertical scroll of the photo reel — handy for a sidebar gallery or scorecard preview.`,...b.parameters?.docs?.description}}},x=[`Playground`,`Looping`,`IndicatorsOnly`,`WithImagery`,`Vertical`]}))();export{v as IndicatorsOnly,_ as Looping,g as Playground,b as Vertical,y as WithImagery,x as __namedExportsOrder,f as default};