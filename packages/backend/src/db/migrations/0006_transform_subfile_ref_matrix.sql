-- Transform subfile_refs: transform array [x,y,z,a,b,c,d,e,f,g,h,i] → {x,y,z,a,b,c,d,e,f,g,h,i}
UPDATE ldraw_part_geometries
SET subfile_refs = (
  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'colorCode', elem->'colorCode',
      'filename', elem->'filename',
      'transform', jsonb_build_object(
        'x', elem->'transform'->0,
        'y', elem->'transform'->1,
        'z', elem->'transform'->2,
        'a', elem->'transform'->3,
        'b', elem->'transform'->4,
        'c', elem->'transform'->5,
        'd', elem->'transform'->6,
        'e', elem->'transform'->7,
        'f', elem->'transform'->8,
        'g', elem->'transform'->9,
        'h', elem->'transform'->10,
        'i', elem->'transform'->11
      )
    )
  ), '[]'::jsonb)
  FROM jsonb_array_elements(subfile_refs) AS elem
)
WHERE jsonb_array_length(subfile_refs) > 0
  AND jsonb_typeof(subfile_refs->0->'transform') = 'array';
