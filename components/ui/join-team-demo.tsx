import { JoinSection } from "@/components/ui/join-section"
import { getDictionary } from "@/content/dictionary"

// JoinSection's props are required, so this names a locale explicitly. It used to rely on
// the English default that made a Serbian caller silently render English copy.
const JoinTeamDemo = () => {
    const en = getDictionary("en")
    return (
        <JoinSection copy={en.careers} trust={en.home.trust}/>
    )
}

export { JoinTeamDemo }
