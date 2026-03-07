-- Transform lines: {colorCode, vertices: [x1,y1,z1,x2,y2,z2]} → {colorCode, v1: {x,y,z}, v2: {x,y,z}}
UPDATE ldraw_part_geometries
SET lines = (
  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'colorCode', elem->'colorCode',
      'v1', jsonb_build_object('x', elem->'vertices'->0, 'y', elem->'vertices'->1, 'z', elem->'vertices'->2),
      'v2', jsonb_build_object('x', elem->'vertices'->3, 'y', elem->'vertices'->4, 'z', elem->'vertices'->5)
    )
  ), '[]'::jsonb)
  FROM jsonb_array_elements(lines) AS elem
)
WHERE jsonb_array_length(lines) > 0
  AND lines->0 ? 'vertices';
--> statement-breakpoint
-- Transform triangles: {colorCode, vertices: [x1,y1,z1,...,x3,y3,z3]} → {colorCode, v1, v2, v3}
UPDATE ldraw_part_geometries
SET triangles = (
  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'colorCode', elem->'colorCode',
      'v1', jsonb_build_object('x', elem->'vertices'->0, 'y', elem->'vertices'->1, 'z', elem->'vertices'->2),
      'v2', jsonb_build_object('x', elem->'vertices'->3, 'y', elem->'vertices'->4, 'z', elem->'vertices'->5),
      'v3', jsonb_build_object('x', elem->'vertices'->6, 'y', elem->'vertices'->7, 'z', elem->'vertices'->8)
    )
  ), '[]'::jsonb)
  FROM jsonb_array_elements(triangles) AS elem
)
WHERE jsonb_array_length(triangles) > 0
  AND triangles->0 ? 'vertices';
--> statement-breakpoint
-- Transform quads: {colorCode, vertices: [x1,y1,z1,...,x4,y4,z4]} → {colorCode, v1, v2, v3, v4}
UPDATE ldraw_part_geometries
SET quads = (
  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'colorCode', elem->'colorCode',
      'v1', jsonb_build_object('x', elem->'vertices'->0, 'y', elem->'vertices'->1, 'z', elem->'vertices'->2),
      'v2', jsonb_build_object('x', elem->'vertices'->3, 'y', elem->'vertices'->4, 'z', elem->'vertices'->5),
      'v3', jsonb_build_object('x', elem->'vertices'->6, 'y', elem->'vertices'->7, 'z', elem->'vertices'->8),
      'v4', jsonb_build_object('x', elem->'vertices'->9, 'y', elem->'vertices'->10, 'z', elem->'vertices'->11)
    )
  ), '[]'::jsonb)
  FROM jsonb_array_elements(quads) AS elem
)
WHERE jsonb_array_length(quads) > 0
  AND quads->0 ? 'vertices';
