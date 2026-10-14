from typing import Any


def build_gemini_schema(model: type[Any]) -> dict[str, Any]:
    schema = model.model_json_schema()

    _remove_unsupported_fields(schema)

    return schema


def _remove_unsupported_fields(schema: dict[str, Any]) -> None:
    schema.pop("additionalProperties", None)
    schema.pop("additional_properties", None)

    properties = schema.get("properties")

    if isinstance(properties, dict):
        for property_schema in properties.values():
            if isinstance(property_schema, dict):
                _remove_unsupported_fields(property_schema)

    items = schema.get("items")

    if isinstance(items, dict):
        _remove_unsupported_fields(items)

    definitions = schema.get("$defs")

    if isinstance(definitions, dict):
        for definition in definitions.values():
            if isinstance(definition, dict):
                _remove_unsupported_fields(definition)