import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Icon, T } from "../../../components/primitives";
import { Pressable } from "../../../components/pressable";
import { Screen } from "../../../components/screen";
import { Chip, LearnHeader } from "../../../components/learn";
import { glossary, glossaryCategories, type GlossaryCategory } from "../../../content/learn";
import { searchGlossary } from "../../../domain/learn-progress";
import { markControlTouch } from "../../../features/touch-guard";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

export default function Glossary() {
  const params = useLocalSearchParams<{ term?: string }>(),
    [query, setQuery] = useState(
      glossary.find((t) => t.id === params.term)?.term ?? "",
    ),
    [category, setCategory] = useState<GlossaryCategory | null>(null),
    results = searchGlossary(glossary, query, category);
  return (
    <Screen back="/learn" label="Learn">
      <View style={[s.page, { gap: 20, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow={`${glossary.length} terms`}
          title="Glossary"
          summary="The words you will hear at the wall, and the ones Bouldy uses."
        />
        <View>
          <TextInput
            onTouchStart={(event) => markControlTouch(event.nativeEvent.timestamp)}
            accessibilityLabel="Search glossary"
            value={query}
            onChangeText={setQuery}
            placeholder="Search a term"
            placeholderTextColor={c["ink-faint"]}
            autoCorrect={false}
            autoCapitalize="none"
            style={{
              minHeight: 48,
              borderWidth: 1,
              borderColor: c.hairline,
              borderRadius: 999,
              paddingLeft: 16,
              paddingRight: query ? 48 : 16,
              fontFamily: "Geist-400",
              fontSize: 16,
              color: c.ink,
              backgroundColor: c.bg,
            }}
          />
          {query ? (
            <Pressable
              accessibilityLabel="Clear search"
              onPress={() => setQuery("")}
              style={{ position: "absolute", right: 0, top: 2, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
            >
              <Icon name="close" size={16} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          style={{ marginHorizontal: -20 }}
        >
          <Chip label="All" active={!category} onPress={() => setCategory(null)} />
          {glossaryCategories.map((name) => (
            <Chip
              key={name}
              label={name}
              active={category === name}
              onPress={() => setCategory(category === name ? null : name)}
            />
          ))}
        </ScrollView>
        <View style={{ marginHorizontal: -20, borderTopWidth: 1, borderColor: c.hairline }}>
          {results.length ? (
            results.map((term) => (
              <View
                key={term.id}
                accessible
                accessibilityLabel={`${term.term}, ${term.category}. ${term.definition}`}
                style={{ paddingHorizontal: 20, paddingVertical: 14, gap: 4, borderBottomWidth: 1, borderColor: c.hairline }}
              >
                <View style={[s.between, { gap: 12 }]}>
                  <T size={17} weight={700} style={{ flexShrink: 1 }}>
                    {term.term}
                  </T>
                  <T size={12} weight={600} color={c["ink-faint"]}>
                    {term.category}
                  </T>
                </View>
                <T size={15} color={c["ink-muted"]} style={{ lineHeight: 22, maxWidth: 520 }}>
                  {term.definition}
                </T>
              </View>
            ))
          ) : (
            <View style={{ padding: 20 }}>
              <T color={c["ink-muted"]}>No terms match “{query.trim()}”.</T>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}
