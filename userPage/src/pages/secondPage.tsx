



export default function SecondPage({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
    return (
        <div ref={ref} className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1>Second Page</h1>
        </div>
    );
}