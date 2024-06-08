
export const metadata = {
    title: "Slide App",
}

function LayoutSlide({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-10 py-10">{children}</div>
    )
}

export default LayoutSlide